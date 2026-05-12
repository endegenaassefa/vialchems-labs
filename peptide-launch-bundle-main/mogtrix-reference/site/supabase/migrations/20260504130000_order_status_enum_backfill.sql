update public.orders
set status = 'payment_pending'
where status = 'pending_payment';

update public.orders
set status = 'completed'
where status = 'delivered';

update public.order_status_history
set next_status = 'payment_pending'
where next_status = 'pending_payment';

update public.order_status_history
set previous_status = 'payment_pending'
where previous_status = 'pending_payment';

update public.order_status_history
set next_status = 'completed'
where next_status = 'delivered';

update public.order_status_history
set previous_status = 'completed'
where previous_status = 'delivered';
