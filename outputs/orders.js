(() => {
  let token = '';
  const $ = id => document.getElementById(id);
  async function load() {
    $('admin-status').textContent = 'Loading…';
    try {
      const response = await fetch('/api/admin/orders', {headers:{Authorization:`Bearer ${token}`}});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      $('order-rows').replaceChildren();
      for (const order of result.orders) {
        const tr = document.createElement('tr'), p = order.payload;
        const cells = [order.reference+'\n'+new Date(order.created_at*1000).toLocaleString(),
          `${p.customer.name}\n${p.customer.email}\n${p.customer.phone}`,
          p.items.map(i => `${i.name} × ${i.quantity}`).join('\n'),
          `${p.fulfilment.label}\n${p.address}\n${p.notes}`,
          `${order.status.toUpperCase()}\n₦${(order.amount/100).toLocaleString()}\n${order.paid_at ? 'Paid '+new Date(order.paid_at*1000).toLocaleString() : 'Do not fulfil until paid'}\n${order.alert_sent_at ? 'Email alert sent' : order.status === 'paid' ? 'Email alert pending' : ''}`];
        for (const value of cells) { const td = document.createElement('td'); td.textContent = value; tr.append(td); }
        $('order-rows').append(tr);
      }
      $('orders').hidden = false; $('refresh').hidden = false; $('logout').hidden = false; $('login').hidden = true;
      $('admin-status').textContent = `${result.orders.length} recent orders. Only PAID orders are ready for fulfilment.`;
    } catch (error) { $('admin-status').textContent = error.message || 'Unable to load orders.'; }
  }
  $('login').addEventListener('submit', event => { event.preventDefault(); token = $('token').value; $('token').value = ''; load(); });
  $('refresh').addEventListener('click', load);
  $('logout').addEventListener('click', () => { token=''; $('order-rows').replaceChildren(); $('orders').hidden=true; $('refresh').hidden=true; $('logout').hidden=true; $('login').hidden=false; $('admin-status').textContent='Order desk locked.'; });
})();
