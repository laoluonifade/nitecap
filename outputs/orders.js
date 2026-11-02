(() => {
  let token = '', page = 1;
  const $ = id => document.getElementById(id);
  async function load() {
    $('admin-status').textContent = 'Loading…';
    try {
      const response = await fetch((location.hostname === 'localhost' || location.hostname === '127.0.0.1' ? '' : 'https://nitecap-checkout.onrender.com')+'/api/admin/orders?page='+page, {headers:{Authorization:`Bearer ${token}`}});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      $('order-rows').replaceChildren();
      for (const order of result.orders) {
        const tr = document.createElement('tr'), p = order.payload;
        const cells = [order.reference+'\n'+new Date(order.created_at*1000).toLocaleString(),
          `${p.customer.name}\n${p.customer.email}\n${p.customer.phone}`,
          p.items.map(i => `${i.name} × ${i.quantity}`).join('\n'),
          `${p.fulfilment.label}\n${p.address}\n${p.notes}`,
          `${order.status.toUpperCase()}\nOrder ₦${(order.amount/100).toLocaleString()}\nCharged ₦${((order.charged_amount || order.amount)/100).toLocaleString()}\n${order.paid_at ? 'Paid '+new Date(order.paid_at).toLocaleString() : 'Do not fulfil until paid'}}`];
        for (const value of cells) { const td = document.createElement('td'); td.textContent = value; tr.append(td); }
        $('order-rows').append(tr);
      }
      $('orders').hidden = false; $('refresh').hidden = false; $('logout').hidden = false; $('login').hidden = true;
      $('admin-status').textContent = `Page ${page}: ${result.orders.length} Nitecap orders. Only PAID orders are ready for fulfilment.`; $('previous').hidden=page===1; $('next').hidden=!result.has_more;
    } catch (error) { $('admin-status').textContent = error.message || 'Unable to load orders.'; }
  }
  $('login').addEventListener('submit', event => { event.preventDefault(); page=1; token = $('token').value; $('token').value = ''; load(); });
  $('previous').addEventListener('click', () => { page--; load(); });
  $('next').addEventListener('click', () => { page++; load(); });
  $('refresh').addEventListener('click', load);
  $('logout').addEventListener('click', () => { token=''; $('order-rows').replaceChildren(); $('orders').hidden=true; $('next').hidden=true; $('previous').hidden=true; $('refresh').hidden=true; $('logout').hidden=true; $('login').hidden=false; $('admin-status').textContent='Order desk locked.'; });
})();
