const categories = [
  ['◎','Consumer insights','8 vendors',true],['⌁','Trend & demand sensing','6 vendors',true],['✦','Concept generation','7 vendors',true],['⚗','Formulation & R&D','5 vendors',false],['▱','Packaging & design','4 vendors',true],['✓','Claims & compliance','3 vendors',false],['▥','Pricing & portfolio','4 vendors',false],['▶','Content & go-to-market','5 vendors',true],['⌘','Innovation knowledge','3 vendors',false],['⬡','Horizontal platforms','3 vendors',true]
];
const decisions = [
  ['N','NeuralTaste','Pilot verdict','Today','#ece9ff','#6353d2'],['T','TrendLens AI','Assessment tier','Aug 02','#e6f5ff','#3c8dcc'],['P','Packwise','Advance to screen','Aug 04','#fff1e4','#cc7937']
];
const categoryGrid = document.querySelector('#categoryGrid');
categoryGrid.innerHTML = categories.map(([icon,name,count,healthy]) => `<article class="category-card" tabindex="0"><header><span class="category-icon">${icon}</span><i class="health ${healthy?'':'needs'}"></i></header><h3>${name}</h3><p>${count} · ${healthy?'Healthy coverage':'Needs coverage'}</p></article>`).join('');
document.querySelector('#decisions').innerHTML = decisions.map(([initial,name,type,due,bg,color]) => `<div class="decision"><div class="vendor-name"><span class="vendor-logo" style="background:${bg};color:${color}">${initial}</span><div><strong>${name}</strong><small>${type}</small></div></div><span>Due ${due}</span><button>Review →</button></div>`).join('');

const modal = document.querySelector('#vendorModal');
document.querySelector('#addVendor').addEventListener('click', () => modal.showModal());
document.querySelector('#vendorForm').addEventListener('submit', event => {
  const form = event.currentTarget;
  if (!form.checkValidity()) { event.preventDefault(); form.reportValidity(); return; }
  const toast = document.querySelector('#toast');
  toast.querySelector('strong').textContent = `${new FormData(form).get('name')} added`;
  toast.classList.add('show'); form.reset();
  setTimeout(() => toast.classList.remove('show'), 3200);
});

const links = document.querySelectorAll('.nav-link[data-view]');
links.forEach(link => link.addEventListener('click', event => {
  links.forEach(item => item.classList.remove('active')); link.classList.add('active');
  document.querySelector('#sidebar').classList.remove('open');
  if (!['overview','categories'].includes(link.dataset.view)) {
    event.preventDefault();
    document.querySelector('#globalSearch').value = link.textContent.trim().replace(/\d+/g,'').trim();
    document.querySelector('#globalSearch').focus();
  }
}));
document.querySelector('#mobileMenu').addEventListener('click', () => document.querySelector('#sidebar').classList.toggle('open'));
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.querySelector('#globalSearch').focus(); }
  if (event.key === 'Escape') document.querySelector('#sidebar').classList.remove('open');
});
document.querySelector('#globalSearch').addEventListener('input', event => {
  const query = event.target.value.toLowerCase();
  document.querySelectorAll('.category-card').forEach(card => card.style.display = card.textContent.toLowerCase().includes(query) ? '' : 'none');
});
