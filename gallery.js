const cards = [...document.querySelectorAll('.customer-card')];
const dialog = document.querySelector('#photoDialog');
const inquiry = document.querySelector('#inquiryDialog');
const choice = document.querySelector('#vehicleChoice');
let activeCard = 0, activePhoto = 0;
const photos = cards.map(card => {
  const thumbs = [...card.querySelectorAll('.thumb')];
  const main = card.querySelector('.photo-open img');
  return thumbs.length ? thumbs.map(t => ({src:t.dataset.src,alt:t.dataset.alt})) : [{src:main.getAttribute('src'),alt:main.alt}];
});
function selectPhoto(c, i) {
  const card=cards[c], photo=photos[c][i];
  card.querySelector('.photo-open img').src=photo.src;
  card.querySelector('.photo-open img').alt=photo.alt;
  card.dataset.selected=i;
  card.querySelectorAll('.thumb').forEach((t,n)=>t.setAttribute('aria-pressed',String(n===i)));
  card.querySelector('.card-status').textContent=`Photo ${i+1} of ${photos[c].length}`;
}
function showPhoto() {
  const photo=photos[activeCard][activePhoto];
  document.querySelector('#fullPhoto').src=photo.src;
  document.querySelector('#fullPhoto').alt=photo.alt;
  document.querySelector('#photoTitle').textContent=cards[activeCard].querySelector('h3').textContent;
  document.querySelector('#photoCaption').textContent=photo.alt;
  document.querySelector('#photoCount').textContent=`Photo ${activePhoto+1} of ${photos[activeCard].length}`;
  document.querySelector('#previousPhoto').disabled=photos[activeCard].length===1;
  document.querySelector('#nextPhoto').disabled=photos[activeCard].length===1;
  selectPhoto(activeCard,activePhoto);
}
function movePhoto(delta) { activePhoto=(activePhoto+delta+photos[activeCard].length)%photos[activeCard].length; showPhoto(); }
function openInquiry(name='General inquiry') {
  choice.value=name;
  document.querySelector('#copyStatus').textContent='';
  inquiry.showModal();
}
cards.forEach((card,c)=>{
  const name=card.querySelector('h3').textContent;
  choice.add(new Option(name,name));
  const status=document.createElement('p');status.className='card-status';status.setAttribute('role','status');card.append(status);
  const ask=document.createElement('button');ask.className='textlink card-inquiry';ask.textContent='Start an inquiry';ask.setAttribute('aria-label',`Start an inquiry about ${name}`);ask.onclick=()=>openInquiry(name);card.append(ask);

  card.querySelectorAll('.thumb').forEach((t,i)=>t.onclick=()=>selectPhoto(c,i));
  card.querySelector('.photo-open').onclick=()=>{activeCard=c;activePhoto=Number(card.dataset.selected);showPhoto();dialog.showModal();};
  selectPhoto(c,0);
});
document.querySelector('#previousPhoto').onclick=()=>movePhoto(-1);
document.querySelector('#nextPhoto').onclick=()=>movePhoto(1);
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();movePhoto(e.key==='ArrowLeft'?-1:1);}});
document.querySelector('#closePhoto').onclick=()=>dialog.close();
document.querySelector('#photoInquiry').onclick=()=>{const name=cards[activeCard].querySelector('h3').textContent;dialog.close();openInquiry(name);};
document.querySelector('#inquiry').onclick=()=>openInquiry();
document.querySelector('#closeDialog').onclick=()=>inquiry.close();
document.querySelector('#copyInquiry').onclick=async()=>{
 const message=document.querySelector('#inquiryMessage');
 if(!message.value.trim()){document.querySelector('#copyStatus').textContent='Enter a message to copy.';message.focus();return;}
 const text=`Quarter Horses inquiry\nInterest: ${choice.value}\n\n${message.value.trim()}`;
 try{await navigator.clipboard.writeText(text);document.querySelector('#copyStatus').textContent='Message copied. Paste it into your email or messaging app.';}
 catch{message.value=text;message.focus();message.select();document.querySelector('#copyStatus').textContent='Select and copy your message above.';}
};
const links=[...document.querySelectorAll('nav a')];
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -50% 0px',threshold:0});
links.forEach(a=>{const target=document.querySelector(a.hash);if(target)observer.observe(target);});
