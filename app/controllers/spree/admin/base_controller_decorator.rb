module Spree
  Admin::BaseController.class_eval do
    # before_filter :get_chat_users

    # def get_chat_users
    #   admin_ids = Spree::User.admin.collect(&:id).push(0)
    #   @chat_users = Spree::User.where.not(id: admin_ids).limit(100)
    # end
  end
end