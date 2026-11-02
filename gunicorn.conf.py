def post_worker_init(worker):
    import threading
    import time
    from server import deliver_alerts

    def run():
        while True:
            try:
                deliver_alerts()
            except Exception:
                worker.log.error("Order notification worker failed; will retry.")
            time.sleep(30)

    threading.Thread(target=run, daemon=True, name="order-alerts").start()
