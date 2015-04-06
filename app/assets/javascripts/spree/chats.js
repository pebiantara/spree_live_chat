jug.on('connect', function(){
  jug.subscribe(jug.collection_data().id, function(data){
    if (Array.isArray(data)){
      data = sortByKey(data, 'time');
      data = data.reverse();
      $.each(data, function(i, content){
        if(content)
          process_subscribed(JSON.parse(content), true);
      });
    }else{
      process_subscribed(data);
    }
  });
})

sortByKey = function (array, key) {
    return array.sort(function(a, b) {
      if(a && b){
        a = JSON.parse(a);
        b = JSON.parse(b);
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));        
      }
    });
}

process_subscribed = function(data, reverse){
  reverse = reverse ? reverse : false;
  createBox(data.from, data.name);
  if(reverse)
    $("[data-id='"+data.from+"']").find('ul').prepend(textContent(data));
  else
    $("[data-id='"+data.from+"']").find('ul').append(textContent(data));


  $("[data-id='"+data.from+"']").find('ul').scrollTop($("[data-id='"+data.from+"']").find('ul')[0].scrollHeight);
  if(data.id == jug.collection_data().id){
    $("[data-id='"+data.from+"']").find('input').val('');
  }else{
    $("[data-id='"+data.from+"']").addClass('new-message');
  }
}

textContent = function(data){
  if(data.id == jug.collection_data().id){
    return "<li>"+data.message+"<br/><small>you - "+data.time+"</small></li>"
  }else{
    return "<li>"+data.message+"<br/><small>"+data.name+" - "+data.time+"</small></li>"
  }
}

createBox = function(id, name){
  domE = $("[data-id='"+id+"']");
  if(domE.length != 0){
    if(!domE.hasClass('open'))
      domE.addClass('open')
  }else{
    $(".chat-box-personal").append(chatBox(id, name));
    jug.get_history(jug.collection_data().id, {from: id});
  }
}

chatBox = function(id, name){
  html = "<div class=\"main-box open\" data-id=\""+id+"\"><div class=\"head\" onclick=\"$(this).parent().toggleClass('open');\"><i class=\"fa fa-comments\"></i>&nbsp;";
  html += name.split("@")[0] ;
  html +="<i class=\"fa fa-remove pull-right\" onclick=\"$(this).parents().eq(1).remove();\"></i></div>";
  html +="<div class=\"body-box\">";
  html +="<ul></ul>";
  html +="<div class=\"text-chat\"><input type=\"text\" placeholder=\"tulis pesan\" onfocus=\"$(this).parents().eq(2).removeClass('new-message');\" onkeyup=\"writeMessage(event, '"+id+"', this);\"></input></div>";
  html += "</div></div>";
  return html;
}

writeMessage = function(data, id, domE){
  if(data.which===13){
    //send to user
    text = $(domE).val();
    me = jug.collection_data();
    textTime = currentTime();
    //publish to other
    jug.publish(id, {id: me.id, from: me.id, message: text, name: me.email.split("@")[0], time: textTime});
    //publish to self
    jug.publish(me.id, {id: me.id, from: id, message: text, name: me.email.split("@")[0], time: textTime});
  }
}

currentTime = function(){
  time = new Date();
  hours = time.getHours();
  minutes = time.getMinutes();
  hours = hours.toString().length == 1 ? "0"+hours : hours;
  minutes = minutes.toString().length == 1 ? "0"+minutes : minutes;
  arrMonth = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  month = arrMonth[time.getMonth()];
  date = time.getDate();
  return month + " " + date + ", " + hours + ":" +minutes;
}

$(document).ready(function() {
  $(".chat-box-list-user .head").on('click', function() {
    $(".chat-box-list-user").toggleClass('open');
  });  
});