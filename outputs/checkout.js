(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const money = kobo => new Intl.NumberFormat('en-NG', {style:'currency', currency:'NGN', maximumFractionDigits:0}).format(kobo / 100);
  let catalog, busy = false, paid = false, pending = null, requestId = crypto.randomUUID();
  const cart = {};
  let pollTimer, polls = 0;
  const storage = {
    get() { try { return JSON.parse(sessionStorage.getItem('nitecap-payment') || 'null'); } catch { return null; } },
    set(value) { try { sessionStorage.setItem('nitecap-payment', JSON.stringify(value)); } catch {} },
    clear() { try { sessionStorage.removeItem('nitecap-payment'); } catch {} }
  };
  async function api(path, payload) {
    const response = await fetch(path, {method: payload ? 'POST' : 'GET', headers:payload ? {'Content-Type':'application/json'} : {}, body:payload ? JSON.stringify(payload) : undefined});
    let data;
    try { data = await response.json(); } catch { throw new Error('Checkout is unavailable. Please email hi@nitecapcocktail.com.'); }
    if (!response.ok) { const error = new Error(data.error || 'Please try again.'); error.reference = data.reference; throw error; }
    return data;
  }
  function status(message) { $('payment-status').textContent = message; }
  function buttonState() {
    const count = Object.values(cart).reduce((a,b) => a+b,0);
    $('pay-button').disabled = busy || paid || !catalog?.enabled || (pending && !pending.access_code) || (!pending && (!count || count > 1000));
    $('pay-button').textContent = busy ? 'Please wait…' : paid ? 'Payment confirmed' : pending ? 'Resume Paystack payment' : 'Pay with Paystack';
    $('customer-fields').disabled = !!pending || paid;
    document.querySelectorAll('.quantity button,.quantity input').forEach(el => { el.disabled = !!pending || paid || busy; });
  }
  function drawCart() {
    const list = $('cart-items'); list.replaceChildren();
    let count = 0, subtotal = 0;
    for (const p of catalog.products) {
      if (!cart[p.id]) continue;
      count += cart[p.id]; subtotal += cart[p.id] * p.price;
      const li = document.createElement('li');
      const name = document.createElement('span'); name.textContent = `${p.name} × ${cart[p.id]}`;
      const total = document.createElement('span'); total.textContent = money(cart[p.id] * p.price);
      li.append(name,total); list.append(li);
    }
    if (!count) { const li = document.createElement('li'); li.textContent = 'Your basket is waiting.'; list.append(li); }
    const option = catalog.fulfilment.find(o => o.id === $('fulfilment').value);
    const fee = (option?.fee_naira || 0) * 100;
    $('cart-count').textContent = count;
    $('subtotal').textContent = money(subtotal);
    $('delivery-total').textContent = money(fee);
    $('total').textContent = money(pending?.amount || subtotal+fee);
    $('address-field').hidden = option?.requires_address === false;
    $('address').required = option?.requires_address !== false;
    buttonState();
  }
  function drawMenu() {
    for (const p of catalog.products) {
      const article = document.createElement('article'); article.className = 'order-product';
      const img = document.createElement('img'); img.src = p.image; img.alt = p.name;
      const details = document.createElement('div'); details.className = 'details';
      const kind = document.createElement('span'); kind.className = 'kind'; kind.textContent = p.kind;
      const title = document.createElement('h3'); title.textContent = p.name;
      const price = document.createElement('p'); price.className = 'price'; price.textContent = `${money(p.price)} / can`;
      const qty = document.createElement('div'); qty.className = 'quantity';
      const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.setAttribute('aria-label', `Remove one ${p.name}`);
      const input = document.createElement('input'); input.type = 'number'; input.min = 0; input.max = 1000; input.step = 1; input.value = cart[p.id] || 0; input.setAttribute('aria-label', `${p.name} quantity`);
      const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', `Add one ${p.name}`);
      function change(n) {
        if (pending || paid || busy) return;
        cart[p.id] = Math.min(1000, Math.max(0, Math.trunc(Number(n) || 0)));
        input.value = cart[p.id]; requestId = crypto.randomUUID(); drawCart();
      }
      minus.addEventListener('click', () => change(Number(input.value)-1));
      plus.addEventListener('click', () => change(Number(input.value)+1));
      input.addEventListener('change', () => change(input.value));
      qty.append(minus,input,plus); details.append(kind,title,price,qty); article.append(img,details); $('menu').append(article);
    }
  }
  async function check() {
    if (!pending) return;
    $('check-payment').disabled = true;
    try {
      const result = await api('/api/verify', {reference:pending.reference});
      if (result.status === 'paid') {
        paid = true; clearTimeout(pollTimer); pending.amount = result.amount; storage.set(pending);
        status(`Payment confirmed. Your Nitecap order is received! Total: ${money(result.amount)}. Reference: ${result.reference}. Keep this reference for any questions about delivery.`);
        $('check-payment').hidden = true; $('new-order').hidden = false;
      } else {
        status(`Payment is not confirmed yet. Resume checkout if you haven't paid, or check again if your payment is processing. Reference: ${pending.reference}.`);
      }
    } catch (error) { status(`${error.message} Your reference: ${pending.reference}.`); }
    finally { $('check-payment').disabled = false; buttonState(); }
  }
  function poll() {
    clearTimeout(pollTimer);
    if (paid || polls++ >= 15) return;
    pollTimer = setTimeout(async () => { await check(); poll(); }, 8000);
  }
  $('checkout-form').addEventListener('input', () => { if (!pending) requestId = crypto.randomUUID(); });
  $('fulfilment').addEventListener('change', drawCart);
  $('check-payment').onclick = check;
  $('new-order').addEventListener('click', () => { storage.clear(); location.href = 'order.html'; });
  $('checkout-form').addEventListener('submit', async event => {
    event.preventDefault(); if (busy || paid) return;
    if (typeof window.PaystackPop !== 'function') { status('Paystack could not load. Please check your connection and try again.'); return; }
    busy = true; buttonState();
    try {
      if (!pending) {
        const data = new FormData(event.target);
        const items = catalog.products.filter(p => cart[p.id]).map(p => ({id:p.id, quantity:cart[p.id]}));
        const result = await api('/api/orders', {request_id:requestId, items,
          customer:{name:data.get('name'), email:data.get('email'), phone:data.get('phone')},
          fulfilment_id:data.get('fulfilment_id'), address:data.get('address'), notes:data.get('notes'), age_confirmed:$('age-confirmed').checked});
        pending = {...result, items, amount:items.reduce((sum,i) => sum+catalog.products.find(p => p.id===i.id).price*i.quantity,0)+(catalog.fulfilment.find(o => o.id===data.get('fulfilment_id'))?.fee_naira || 0)*100};
        storage.set(pending);
      }
      $('check-payment').hidden = false; $('check-payment').onclick = check;
      if (pending.status === 'paid') { await check(); return; }
      const popup = new window.PaystackPop();
      popup.resumeTransaction(pending.access_code);
      status(`Complete your payment in Paystack. Your order reference is ${pending.reference}.`);
      polls = 0; poll();
    } catch (error) {
      if (error.reference) {
        status(`${error.message} Reference: ${error.reference}.`);
        $('check-payment').hidden = false;
        $('check-payment').onclick = async () => {
          const old = pending; pending = {reference:error.reference}; await check();
          if (!paid) pending = old; else storage.set(pending);
        };
      } else status(error.message);
    }
    finally { busy = false; buttonState(); }
  });
  async function load() {
    try {
      catalog = await api('/api/catalog');
      pending = storage.get();
      if (pending && !/^NC-[a-f0-9]{32}$/.test(pending.reference || '')) { pending = null; storage.clear(); }
      if (pending?.items) for (const item of pending.items) cart[item.id] = item.quantity;
      $('fulfilment').replaceChildren();
      for (const option of catalog.fulfilment) {
        const el = document.createElement('option'); el.value = option.id; el.textContent = option.label; $('fulfilment').append(el);
      }
      drawMenu(); drawCart();
      $('availability').hidden = catalog.enabled;
      if (!catalog.enabled) $('availability').textContent = 'Online payments are being prepared. Browse the menu below, or email hi@nitecapcocktail.com to order.';
      const callbackReference = new URLSearchParams(location.search).get('reference');
      if (callbackReference && /^NC-[a-f0-9]{32}$/.test(callbackReference)) {
        pending = {reference:callbackReference}; storage.set(pending);
        history.replaceState(null,'',location.pathname);
      }
      if (pending) { $('check-payment').hidden = false; await check(); }
    } catch { $('availability').hidden = false; $('availability').textContent = 'Online checkout is unavailable. Please email hi@nitecapcocktail.com to order.'; }
  }
  load();
})();
