var jug, li_content;

jug = new Juggernaut({
  port: 3001
});

jug.on('connect', function() {
  jug.subscribe("bind-users-online-" + Spree.current_tenant, function(data){
    $(".body-box .user-active").remove();
    $.each(data, function(x,val){
      jug.update_box(JSON.parse(val));
    });
  });

  jug.add_online("bind-users-online-" + Spree.current_tenant, jug.collection_data());
});

jug.on('disconnect', function() {
  log('Disconnected');
});

jug.on('reconnect', function() {
  log('Reconnecting');
});

jug.update_box = function(data) {
  var box_updated, c, cl;
  // if (("user-" + Spree.current_user_id) === data.id)
  //   return;

  if(Spree.current_user_id !== ""){
    c = $("[data-channel='user-"+ Spree.current_ip +"']");
    if(c.length > 0)
      c.remove();
  }

  box_updated = "box-" + (data.admin === 'true' ? 'user' : 'admin');
  if(data.admin === 'true'){
    $("." + box_updated + " ul").prepend(li_content(data.id, data.email));
  }else{
    if(data.guest){
      $(li_content(data.id, data.email)).insertAfter("." + box_updated + " ul li.guest");
    }else{
      $(li_content(data.id, data.email)).insertAfter("." + box_updated + " ul li.members");
    }
  }
};

li_content = function(id, name) {
  return "<li data-channel=\""+id+"\" id=\""+ id +"\" class=\"user-active active\"><a href=\"javascript:void(0)\"><i class=\"fa fa-dot-circle-o\"></i>" + name.split("@")[0] + "</a>";
};

jug.publish_to_list = function() {  
  jug.get_online_users('bind-users-online-'+ Spree.current_tenant, jug.collection_data());
};

jug.collection_data = function(){
  var data, email, guest, user_channel;
  user_channel = Spree.current_ip;
  guest = true;
  email = Spree.current_ip;
  if (Spree.current_user_id !== "") {
    user_channel = Spree.current_user_id;
    guest = false;
    email = Spree.current_user_email;
  }
  data = {
    id: "user-" + user_channel,
    admin: Spree.current_user_admin,
    guest: guest,
    email: email,
    tenant: Spree.current_tenant
  };
  return data;
}

$(document).ready(function() {
  $(".chat-box-list-user .head").on('click', function() {
    $(".chat-box-list-user").toggleClass('open');
  });  
});

$(window).bind('unload', function(){ 
  jug.rem_user_online("bind-users-online-" + Spree.current_tenant, jug.collection_data());
});