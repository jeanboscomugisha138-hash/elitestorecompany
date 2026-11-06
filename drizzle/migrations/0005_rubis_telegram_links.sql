update public.site_settings
set value = case key
  when 'telegram_admin_url' then 'https://t.me/rubisshare'
  when 'customer_service_url' then 'https://t.me/rubisshare'
  when 'telegram_meeting_url' then 'https://t.me/rubissharecommunity'
  when 'telegram_group_url' then 'https://t.me/rubissharecommunity'
  else value end
where key in ('telegram_admin_url','customer_service_url','telegram_meeting_url','telegram_group_url');