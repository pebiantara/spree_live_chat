Deface::Override.new(:virtual_path => 'spree/layouts/spree_application',
  :name => 'add_script_frontend',
  :insert_bottom => "[data-hook=\"inside_head\"]",
  :partial => "spree/shared/script_chat")

Deface::Override.new(:virtual_path => 'spree/layouts/admin',
  :name => 'add_script_backend',
  :insert_bottom => "[data-hook=\"admin_inside_head\"]",
  :partial => "spree/shared/script_chat")

Deface::Override.new(:virtual_path => 'spree/layouts/admin',
  :name => 'add_chat_backend',
  :insert_bottom => "[data-hook=\"admin_inside_head\"]",
  :partial => "spree/shared/chat_box")

Deface::Override.new(:virtual_path => 'spree/layouts/spree_application',
  :name => 'add_chat_frontend',
  :insert_bottom => "[data-hook=\"inside_head\"]",
  :partial => "spree/shared/chat_box")