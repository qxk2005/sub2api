#!/usr/bin/env python3
"""
S2A Sub2API Project Manager & Deployment Script
运行在 S2A pyenv 虚拟环境下的 sub2api 部署与服务调度管理工具。
"""

import sys
import os
import time
import subprocess
import socket
import urllib.request
import json
import signal

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOGS_DIR = os.path.join(BASE_DIR, "logs")
PID_FILE = os.path.join(LOGS_DIR, "pids.json")

os.makedirs(LOGS_DIR, exist_ok=True)

def is_port_open(host, port, timeout=2):
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False

def check_env():
    print("=== Checking S2A Environment & Dependencies ===")
    print(f"Python Executable: {sys.executable}")
    print(f"Python Version: {sys.version.split()[0]}")
    
    pg_ok = is_port_open("127.0.0.1", 5432)
    print(f"PostgreSQL (5432): {'[OK]' if pg_ok else '[FAILED]'}")
    
    redis_ok = is_port_open("127.0.0.1", 6379)
    print(f"Redis (6379):      {'[OK]' if redis_ok else '[FAILED]'}")
    
    config_ok = os.path.exists(os.path.join(BASE_DIR, "config.yaml"))
    print(f"config.yaml:       {'[OK]' if config_ok else '[MISSING]'}")
    
    binary_ok = os.path.exists(os.path.join(BASE_DIR, "backend", "bin", "server"))
    print(f"Backend Binary:    {'[OK]' if binary_ok else '[NOT BUILT YET]'}")

def load_pids():
    if os.path.exists(PID_FILE):
        try:
            with open(PID_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def save_pids(pids):
    with open(PID_FILE, "w") as f:
        json.dump(pids, f)

def is_pid_running(pid):
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False

def start_backend():
    pids = load_pids()
    if "backend" in pids and is_pid_running(pids["backend"]):
        print(f"Backend already running with PID {pids['backend']}")
        return

    bin_path = os.path.join(BASE_DIR, "backend", "bin", "server")
    backend_dir = os.path.join(BASE_DIR, "backend")
    
    if not os.path.exists(bin_path):
        print("Backend binary not found, attempting go run / build...")
        cmd = ["go", "run", "./cmd/server"]
    else:
        cmd = [bin_path]

    log_file = open(os.path.join(LOGS_DIR, "backend.log"), "a")
    proc = subprocess.Popen(
        cmd,
        cwd=backend_dir,
        stdout=log_file,
        stderr=subprocess.STDOUT,
        env=dict(os.environ, CONFIG_FILE=os.path.join(BASE_DIR, "config.yaml"))
    )
    pids["backend"] = proc.pid
    save_pids(pids)
    print(f"Started Backend process (PID {proc.pid}), logging to logs/backend.log")

def start_frontend():
    pids = load_pids()
    if "frontend" in pids and is_pid_running(pids["frontend"]):
        print(f"Frontend already running with PID {pids['frontend']}")
        return

    frontend_dir = os.path.join(BASE_DIR, "frontend")
    cmd = ["pnpm", "dev", "--host", "127.0.0.1", "--port", "3000"]

    log_file = open(os.path.join(LOGS_DIR, "frontend.log"), "a")
    proc = subprocess.Popen(
        cmd,
        cwd=frontend_dir,
        stdout=log_file,
        stderr=subprocess.STDOUT
    )
    pids["frontend"] = proc.pid
    save_pids(pids)
    print(f"Started Frontend process (PID {proc.pid}), logging to logs/frontend.log")

def stop_services():
    pids = load_pids()
    for name, pid in list(pids.items()):
        if is_pid_running(pid):
            print(f"Stopping {name} (PID {pid})...")
            try:
                os.kill(pid, signal.SIGTERM)
            except Exception as e:
                print(f"Error stopping {name}: {e}")
        pids.pop(name, None)
    save_pids(pids)
    print("Services stopped.")

def check_status():
    print("=== Sub2API Running Status ===")
    pids = load_pids()
    for name in ["backend", "frontend"]:
        pid = pids.get(name)
        running = is_pid_running(pid) if pid else False
        print(f"{name.capitalize()}: PID={pid or 'N/A'}, Running={running}")

    print("\n=== HTTP Endpoint Probe ===")
    
    # Check Backend
    try:
        req = urllib.request.urlopen("http://127.0.0.1:8080/health", timeout=3)
        print(f"Backend API (http://127.0.0.1:8080/health): HTTP {req.status}")
    except Exception as e:
        print(f"Backend API Probe (http://127.0.0.1:8080/health): {e}")

    # Check Frontend
    try:
        req = urllib.request.urlopen("http://127.0.0.1:3000", timeout=3)
        print(f"Frontend Web (http://127.0.0.1:3000): HTTP {req.status}")
    except Exception as e:
        print(f"Frontend Web Probe (http://127.0.0.1:3000): {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python s2a_runner.py [check|start|start-backend|start-frontend|stop|status]")
        sys.exit(1)

    cmd = sys.argv[1].lower()
    if cmd == "check":
        check_env()
    elif cmd == "start":
        start_backend()
        start_frontend()
    elif cmd == "start-backend":
        start_backend()
    elif cmd == "start-frontend":
        start_frontend()
    elif cmd == "stop":
        stop_services()
    elif cmd == "status":
        check_status()
    else:
        print(f"Unknown command: {cmd}")

if __name__ == "__main__":
    main()
