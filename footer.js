const socialDialog=document.getElementById('socialDialog');
document.querySelectorAll('[data-social]').forEach(button=>button.addEventListener('click',()=>{
 document.getElementById('socialTitle').textContent=button.dataset.social;
 document.getElementById('socialDescription').textContent='The Quarter Horses '+button.dataset.social+' profile link will be added here.';
 socialDialog.showModal();
}));
document.getElementById('closeSocial').onclick=()=>socialDialog.close();
