var table = document.querySelector('table');
var fieldset = document.querySelector('.mail-field');
var mailTo = document.getElementById('mailto');
var hobby = document.querySelector('.list-group');
var bgBlur = document.querySelector('.bg-blur');
var sendBtn = document.querySelector('.btn-send');
var closeBtn = document.querySelector('#close');
var subject = document.getElementById('subject');
var content= document.getElementById('content');
var mailSucMsg = document.querySelector('.email-success-msg');

fetch('http://localhost:8080/get_contacts')
.then(response=> response.json())
.then(renderTable)
.catch(err=> console.log(err));

function renderTable(data){
   data.forEach(el=> {
   	table.innerHTML += `<tr><td>${el.name}</td><td>${el.lastName}</td><td>${el.email}</td><td>${el.phone}</td><td class="mail">Send email</td><td><button id=${el.id} onClick="sendId(event)" type="button" class="btn btn-info btn" data-toggle="modal" data-target="#myModal">Hobbies</button>
</td></tr>`;
   	getMail();
   })
}

function getMail(){
	var mails = document.querySelectorAll('.mail');
  mails.forEach(el => el.addEventListener('click',(e)=>{
     var email = e.target.parentElement.childNodes[2].textContent;
     var name = e.target.parentElement.firstChild.textContent;
     fieldset.style.display = "block"; 
     bgBlur.style.display = "block";
     mailTo.value = email;   
  }));
}

function sendId(event){
  var id =event.target.id;
  var url = `http://localhost:8080/hobby?id=${id}`
  fetch(url, {
      method: 'POST', 
      credentials: "include", 
      body: id, 
      headers: {'Content-Type': 'text/plain'}
  }).then(res=> res.json()).then(loadHobbies).catch(err=> console.log(err)); 
}

function loadHobbies(data){
   hobby.style.display = "block";
   var spinner = "<i class='fa fa-circle-o-notch fa-spin' style='font-size:24px'></i>";
   hobby.innerHTML = spinner;
   var timeOut = setTimeout(()=>{
                  hobby.innerHTML=''; 
                  data[0].hobbies.forEach(el=>  hobby.innerHTML +=`<a href="#" class="list-group-item">${el.hobby}</a>` );
                },700);
}

sendBtn.addEventListener('click', (e)=>{
   e.preventDefault();
   var mailto =  mailTo.value;
   var mailSub = subject.value;
   var mailContent = content.value;

   var mail = {mailto: mailto,
               subject: mailSub,
               content: mailContent};

   fetch('http://localhost:8080/send-mail', {
         method: 'POST',
         body: JSON.stringify(mail),
         headers:{'Content-Type': 'text/plain'}
   }).then(res=> res.json()).then(emailMsg).catch(err=> console.log(err));
});

function emailMsg(data){
  console.log(data);
  mailSucMsg.innerHTML = data.feedback;
  mailSucMsg.style.display = "block";
  display();
  var displayNone = setTimeout(()=>{   mailSucMsg.style.display = "none"; },3500)
}

bgBlur.addEventListener('click', display);
closeBtn.addEventListener('click', display);

function display(){
   fieldset.style.display = "none";
   bgBlur.style.display = "none";
}