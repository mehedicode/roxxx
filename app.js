const products = [
  {id:1,name:"Premium Leather Watch",category:"Watches",type:"physical",price:1590,originalPrice:1990,rating:4.8,reviews:126,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",featured:true,bestSeller:true,stock:18,cod:true,description:"A clean everyday timepiece with a refined, versatile look."},
  {id:2,name:"Classic Steel Chronograph",category:"Watches",type:"physical",price:2790,originalPrice:3200,rating:4.7,reviews:94,image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",featured:true,bestSeller:true,stock:9,cod:true,description:"A bold chronograph-inspired design for everyday wear."},
  {id:3,name:"Dark Chocolate Gift Box",category:"Chocolates",type:"physical",price:850,originalPrice:1000,rating:4.6,reviews:71,image:"https://images.unsplash.com/photo-1575377427642-087cf684f04d?auto=format&fit=crop&w=900&q=85",featured:true,bestSeller:true,stock:30,cod:true,description:"A rich chocolate selection packaged for gifting."},
  {id:4,name:"Hazelnut Praline Selection",category:"Chocolates",type:"physical",price:1250,originalPrice:null,rating:4.6,reviews:53,image:"https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=85",featured:true,bestSeller:false,stock:22,cod:true,description:"A premium praline-inspired selection for gifting or sharing."},
  {id:5,name:"Minimalist Leather Wallet",category:"Lifestyle",type:"physical",price:990,originalPrice:1290,rating:4.7,reviews:84,image:"https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85",featured:false,bestSeller:true,stock:17,cod:true,description:"A compact everyday wallet with a timeless profile."},
  {id:6,name:"The Disciplined Mind (eBook)",category:"Digital Books",type:"digital",price:520,originalPrice:650,rating:4.8,reviews:112,image:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",featured:true,bestSeller:true,stock:null,cod:false,description:"A practical digital read about focus, routines and better habits."},
  {id:7,name:"Money Habits (eBook)",category:"Digital Books",type:"digital",price:600,originalPrice:750,rating:4.7,reviews:88,image:"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85",featured:true,bestSeller:true,stock:null,cod:false,description:"Simple ideas for spending, saving and everyday money habits."},
  {id:8,name:"Start Small, Build Big (eBook)",category:"Digital Books",type:"digital",price:750,originalPrice:900,rating:4.5,reviews:61,image:"https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=85",featured:true,bestSeller:false,stock:null,cod:false,description:"A concise guide for turning small actions into progress."},
  {id:9,name:"Deep Work Notes (eBook)",category:"Digital Books",type:"digital",price:480,originalPrice:600,rating:4.6,reviews:76,image:"https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=85",featured:true,bestSeller:false,stock:null,cod:false,description:"Practical notes and exercises for focused work and learning."},
  {id:10,name:"Classic Desk Clock",category:"Lifestyle",type:"physical",price:1150,originalPrice:1450,rating:4.4,reviews:42,image:"https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=85",featured:false,bestSeller:false,stock:12,cod:true,description:"A minimal desk companion for workspaces and bedside tables."},
  {id:11,name:"Everyday Gift Chocolate Bar",category:"Chocolates",type:"physical",price:690,originalPrice:790,rating:4.5,reviews:37,image:"https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=85",featured:false,bestSeller:false,stock:26,cod:true,description:"A simple chocolate gift for small celebrations."},
  {id:12,name:"Premium Travel Organizer",category:"Lifestyle",type:"physical",price:1390,originalPrice:1690,rating:4.6,reviews:48,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",featured:false,bestSeller:false,stock:14,cod:true,description:"A practical organizer for travel essentials."}
];

let cart = JSON.parse(localStorage.getItem("aurelian-cart") || "[]");
let activeFilter = {type:null,category:null,query:""};
let currentSort = "featured";
let checkoutState = {step:1,productId:null,fromCart:false,delivery:null};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const productById = id => products.find(p => p.id === Number(id));
const money = n => new Intl.NumberFormat("en-BD",{style:"currency",currency:"BDT",maximumFractionDigits:0}).format(n).replace("BDT","৳");
const discountPercent = p => p.originalPrice && p.originalPrice > p.price ? Math.round((1-p.price/p.originalPrice)*100) : 0;

function showToast(message){
  const t=$("#toast"); t.textContent=message; t.classList.remove("opacity-0","translate-y-5"); t.classList.add("opacity-100","translate-y-0");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>{t.classList.add("opacity-0","translate-y-5");t.classList.remove("opacity-100","translate-y-0")},2200);
}
function saveCart(){localStorage.setItem("aurelian-cart",JSON.stringify(cart));updateCartCount();}
function updateCartCount(){ $("#cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0); }
function addToCart(id){const p=productById(id);if(!p)return;const i=cart.find(x=>x.id===p.id);i?i.qty++:cart.push({id:p.id,qty:1});saveCart();showToast(`${p.name} added to cart`);openCart();}
function removeFromCart(id){cart=cart.filter(i=>i.id!==Number(id));saveCart();renderCart();}
function changeQty(id,n){const i=cart.find(x=>x.id===Number(id));if(!i)return;i.qty+=n;if(i.qty<=0)return removeFromCart(id);saveCart();renderCart();}
function cartTotal(){return cart.reduce((s,i)=>{const p=productById(i.id);return s+(p?p.price*i.qty:0)},0);}

function productCard(p,dark=false){
  const d=discountPercent(p);
  return `<article class="group overflow-hidden rounded-md border ${dark?"border-white/15 bg-white":"border-line bg-white"} shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
    <button data-product="${p.id}" class="relative block w-full text-left">
      <div class="relative aspect-[4/4.5] overflow-hidden bg-gray-100">
        <img src="${p.image}" alt="${p.name}" class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/900x1000/F1F3F5/0F2747?text=Product';">
        ${d?`<span class="absolute right-2 top-2 rounded-[4px] bg-discount px-2 py-1 text-[10px] font-bold text-white">-${d}%</span>`:""}
        ${p.type==="digital"?`<span class="absolute left-2 top-2 rounded-[4px] bg-white/95 px-2 py-1 text-[9px] font-bold text-navy shadow-sm">INSTANT DELIVERY</span>`:""}
      </div>
    </button>
    <div class="p-3 sm:p-4">
      <button data-product="${p.id}" class="block w-full text-left"><h3 class="min-h-[40px] text-[13px] font-bold leading-5 text-navy sm:text-sm">${p.name}</h3></button>
      <div class="mt-2 flex items-center gap-1 text-[11px]"><span class="tracking-wide text-gold">★★★★★</span><span class="text-muted">${p.rating}</span><span class="text-muted">(${p.reviews})</span></div>
      <div class="mt-2 flex items-baseline gap-2"><span class="text-sm font-extrabold text-navy sm:text-base">${money(p.price)}</span>${d?`<span class="text-[11px] text-muted line-through">${money(p.originalPrice)}</span>`:""}</div>
      <div class="mt-3 flex gap-2">
        <button data-buy="${p.id}" class="min-h-11 flex-1 rounded-md bg-brand px-3 text-xs font-bold text-white hover:bg-blue-700 sm:text-sm">Buy Now</button>
        <button data-add="${p.id}" class="min-h-11 min-w-11 rounded-md border border-line bg-white px-3 text-navy hover:border-navy hover:bg-surface" aria-label="Add ${p.name} to cart">
          <svg class="mx-auto h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}
function sorted(list){
  const a=[...list];
  if(currentSort==="priceLow")return a.sort((x,y)=>x.price-y.price);
  if(currentSort==="priceHigh")return a.sort((x,y)=>y.price-x.price);
  if(currentSort==="discount")return a.sort((x,y)=>discountPercent(y)-discountPercent(x));
  return a.sort((x,y)=>Number(y.featured)-Number(x.featured));
}
function filtered(){
  let a=[...products];
  if(activeFilter.type)a=a.filter(p=>p.type===activeFilter.type);
  if(activeFilter.category)a=a.filter(p=>p.category===activeFilter.category);
  if(activeFilter.query){const q=activeFilter.query.toLowerCase();a=a.filter(p=>`${p.name} ${p.category}`.toLowerCase().includes(q));}
  return sorted(a);
}
function renderGrid(sel,list,dark=false){const e=$(sel);if(!e)return;e.innerHTML=list.length?list.map(p=>productCard(p,dark)).join(""):`<div class="col-span-full rounded-md border border-line p-10 text-center"><p class="font-bold text-navy">No products found.</p></div>`;}
function updateResultsHeading(){
  const active=activeFilter.query||activeFilter.category||activeFilter.type;
  $("#resultsTitle").textContent=active?(activeFilter.query?"Search results":activeFilter.category||(activeFilter.type==="digital"?"Digital Products":"Physical Products")):"Featured Products";
  $("#resultsEyebrow").textContent=active?`${filtered().length} product${filtered().length===1?"":"s"} found`:"Curated for you";
  $("#clearFilterBtn").classList.toggle("hidden",!active);
}
function renderFeatured(){const a=filtered();renderGrid("#productGrid",(activeFilter.query||activeFilter.category||activeFilter.type)?a:a.filter(p=>p.featured).slice(0,8));}
function renderBest(){renderGrid("#bestGrid",products.filter(p=>p.bestSeller).slice(0,8));}
function renderDigital(){renderGrid("#digitalGrid",products.filter(p=>p.type==="digital").slice(0,8),true);}
function applyFilter(f={}){activeFilter={type:f.type||null,category:f.category||null,query:f.query||""};$("#desktopSearch").value=activeFilter.query;$("#mobileSearch").value=activeFilter.query;updateResultsHeading();renderFeatured();$("#shopSection").scrollIntoView({behavior:"smooth",block:"start"});}
function clearFilters(){activeFilter={type:null,category:null,query:""};$("#desktopSearch").value="";$("#mobileSearch").value="";updateResultsHeading();renderFeatured();}
function goHome(){clearFilters();window.scrollTo({top:0,behavior:"smooth"});$("#mobileMenu").classList.add("hidden");}
function goShop(){clearFilters();$("#shopSection").scrollIntoView({behavior:"smooth",block:"start"});$("#mobileMenu").classList.add("hidden");}
function goType(type){applyFilter({type});$("#mobileMenu").classList.add("hidden");}

function openProductModal(id){
  const p=productById(id);if(!p)return;const d=discountPercent(p);
  $("#productModalBody").innerHTML=`<div class="overflow-hidden rounded-md border border-line bg-surface"><img src="${p.image}" alt="${p.name}" class="aspect-square w-full object-cover" onerror="this.onerror=null;this.src='https://placehold.co/900x900/F1F3F5/0F2747?text=Product';"></div>
  <div class="flex flex-col"><p class="text-xs font-bold uppercase tracking-wider text-brand">${p.category}</p><h2 class="mt-2 text-2xl font-bold leading-tight text-navy">${p.name}</h2>
  <div class="mt-3 text-sm"><span class="tracking-wide text-gold">★★★★★</span> <span class="text-muted">${p.rating} (${p.reviews})</span></div>
  <div class="mt-5 flex items-baseline gap-3"><span class="text-2xl font-extrabold text-navy">${money(p.price)}</span>${d?`<span class="text-sm text-muted line-through">${money(p.originalPrice)}</span><span class="rounded bg-red-50 px-2 py-1 text-xs font-bold text-discount">-${d}%</span>`:""}</div>
  <p class="mt-5 text-sm leading-6 text-muted">${p.description}</p>
  <div class="mt-5 rounded-md border border-line bg-surface p-4 text-xs text-muted">${p.type==="digital"?"⚡ Instant digital delivery after payment confirmation.":p.cod?"✓ Cash on Delivery is available for this product.":"Online payment is required for this product."}</div>
  <div class="mt-auto grid grid-cols-[1fr_52px] gap-2 pt-6"><button data-buy="${p.id}" class="min-h-12 rounded-md bg-brand px-5 text-sm font-bold text-white hover:bg-blue-700">Buy Now</button><button data-add="${p.id}" class="min-h-12 rounded-md border border-line text-navy" aria-label="Add to cart"><svg class="mx-auto h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg></button></div></div>`;
  $("#productModal").classList.remove("hidden");$("#productModal").classList.add("flex");document.body.classList.add("no-scroll");
}
function closeProductModal(){$("#productModal").classList.add("hidden");$("#productModal").classList.remove("flex");document.body.classList.remove("no-scroll");}

function renderCart(){
  const items=cart.map(i=>({product:productById(i.id),qty:i.qty})).filter(x=>x.product);
  $("#cartSubtotal").textContent=money(cartTotal());$("#checkoutBtn").disabled=!items.length;
  if(!items.length){$("#cartItems").innerHTML=`<div class="flex h-full flex-col items-center justify-center text-center"><div class="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-navy">🛒</div><h3 class="mt-4 font-bold text-navy">Your cart is empty</h3><p class="mt-1 text-sm text-muted">Add something you like and it will appear here.</p></div>`;return;}
  $("#cartItems").innerHTML=items.map(({product:p,qty})=>`<div class="flex gap-3 border-b border-line py-4 first:pt-0"><img src="${p.image}" class="h-20 w-20 rounded-md object-cover"><div class="min-w-0 flex-1"><div class="flex gap-2"><div class="min-w-0 flex-1"><h3 class="text-sm font-bold text-navy">${p.name}</h3><p class="mt-1 text-xs text-muted">${money(p.price)}</p></div><button data-remove="${p.id}" class="text-xs text-muted hover:text-discount">Remove</button></div><div class="mt-3 flex items-center justify-between"><div class="flex items-center rounded-md border border-line"><button data-minus="${p.id}" class="h-8 w-8">−</button><span class="w-8 text-center text-xs font-bold">${qty}</span><button data-plus="${p.id}" class="h-8 w-8">+</button></div><strong class="text-sm text-navy">${money(p.price*qty)}</strong></div></div></div>`).join("");
}
function openCart(){renderCart();$("#cartOverlay").classList.remove("hidden");requestAnimationFrame(()=>$("#cartDrawer").classList.remove("translate-x-full"));}
function closeCart(){$("#cartDrawer").classList.add("translate-x-full");setTimeout(()=>$("#cartOverlay").classList.add("hidden"),300);}

function openCheckout(){ $("#checkoutModal").classList.remove("hidden");$("#checkoutModal").classList.add("flex");document.body.classList.add("no-scroll");}
function closeCheckout(){ $("#checkoutModal").classList.add("hidden");$("#checkoutModal").classList.remove("flex");document.body.classList.remove("no-scroll");resetCheckout();}
function resetCheckout(){checkoutState={step:1,productId:null,fromCart:false,delivery:null};$("#deliveryForm")?.reset();["#checkoutStep1","#checkoutStep2","#checkoutStep3","#checkoutSuccess"].forEach(s=>$(s).classList.add("hidden"));$("#checkoutStep1").classList.remove("hidden");}
function checkoutItems(){return checkoutState.fromCart?cart.map(i=>({product:productById(i.id),qty:i.qty})).filter(x=>x.product):(()=>{const p=productById(checkoutState.productId);return p?[{product:p,qty:1}]:[]})();}
function checkoutTotal(){return checkoutItems().reduce((s,x)=>s+x.product.price*x.qty,0);}
function isDigital(){const a=checkoutItems();return a.length>0&&a.every(x=>x.product.type==="digital");}
function allowsCOD(){const a=checkoutItems();return a.length>0&&a.every(x=>x.product.type==="physical"&&x.product.cod===true);}

function renderCheckoutSummary(){
  const items=checkoutItems();const mixed=new Set(items.map(x=>x.product.type)).size>1;
  $("#checkoutProductSummary").innerHTML=`<div class="rounded-md border border-line"><div class="border-b border-line px-4 py-3"><p class="text-xs font-bold uppercase tracking-wider text-brand">Step 1</p><p class="mt-1 text-sm font-bold text-navy">Review your ${mixed?"order":"product"}</p></div>
  ${items.map(({product:p,qty})=>`<div class="flex gap-3 border-b border-line p-4"><img src="${p.image}" class="h-20 w-20 rounded-md object-cover"><div><p class="text-sm font-bold text-navy">${p.name}</p><p class="mt-1 text-xs text-muted">${p.type==="digital"?"Digital":"Physical"} · Qty ${qty}</p><p class="mt-2 font-extrabold text-navy">${money(p.price*qty)}</p></div></div>`).join("")}
  <div class="flex justify-between bg-surface px-4 py-4 text-sm"><span class="text-muted">Order total</span><strong class="text-lg text-navy">${money(checkoutTotal())}</strong></div></div>
  <div class="mt-4 rounded-md border border-line bg-surface p-4 text-xs leading-5 text-muted">${isDigital()&&!mixed?"⚡ Digital product: no delivery address is required.":allowsCOD()&&!mixed?"✓ COD is enabled for this product. After delivery information your order can be confirmed without online payment.":"ℹ️ Delivery information is required, then online payment will be shown."}</div>`;
  $("#checkoutNextFromProduct").textContent=isDigital()&&!mixed?"Next — Payment":"Next";
}

function updateSteps(){
  const digital=isDigital()&&!checkoutState.fromCart;
  const labels=digital?["Product","Payment","Complete"]:["Product","Delivery",allowsCOD()?"Complete":"Payment"];
  [1,2,3].forEach(n=>{const e=$(`#checkoutSteps [data-step="${n}"]`);e.querySelector("span:last-child").textContent=labels[n-1];const c=e.querySelector("span:first-child"),on=n<=checkoutState.step;c.classList.toggle("bg-brand",on);c.classList.toggle("text-white",on);c.classList.toggle("border",!on);c.classList.toggle("border-line",!on);e.classList.toggle("text-brand",on);e.classList.toggle("text-muted",!on);});
}
function showStep(n){
  checkoutState.step=n;["#checkoutStep1","#checkoutStep2","#checkoutStep3","#checkoutSuccess"].forEach(s=>$(s).classList.add("hidden"));
  if(n===1){$("#checkoutStep1").classList.remove("hidden");$("#checkoutTitle").textContent="Review your order";renderCheckoutSummary();}
  if(n===2){if(isDigital()&&!checkoutState.fromCart){renderPayment(false);$("#checkoutStep3").classList.remove("hidden");$("#checkoutTitle").textContent="Payment";}else{$("#checkoutStep2").classList.remove("hidden");$("#checkoutTitle").textContent="Delivery information";$("#deliveryTotal").textContent=money(checkoutTotal());}}
  if(n===3){if(allowsCOD()){renderCOD();$("#checkoutTitle").textContent="Order confirmation";}else{renderPayment(true);$("#checkoutTitle").textContent="Payment";}$("#checkoutStep3").classList.remove("hidden");}
  updateSteps();
}

function renderPayment(withDelivery){
  const d=checkoutState.delivery;
  $("#checkoutStep3Body").innerHTML=`${withDelivery&&d?`<div class="mb-4 rounded-md border border-line bg-surface p-4 text-xs"><p class="font-bold text-navy">Delivery information</p><p class="mt-1 text-muted">${d.name} · ${d.phone}</p><p class="mt-1 text-muted">${d.district}, ${d.thana}</p><p class="mt-1 text-muted">${d.areaAddress}</p></div>`:""}
  <div class="rounded-md border border-line"><div class="border-b border-line px-4 py-3"><p class="text-xs font-bold uppercase tracking-wider text-brand">Online payment</p><p class="mt-1 text-sm font-bold text-navy">Payment summary</p></div>
  ${checkoutItems().map(x=>`<div class="flex justify-between border-b border-line px-4 py-3 text-sm"><span class="text-muted">${x.product.name} × ${x.qty}</span><strong class="text-navy">${money(x.product.price*x.qty)}</strong></div>`).join("")}
  <div class="flex justify-between bg-surface px-4 py-4"><span class="text-sm font-semibold text-muted">Total</span><strong class="text-xl text-navy">${money(checkoutTotal())}</strong></div></div>
  <div class="mt-4 rounded-md border border-line p-4"><p class="text-sm font-bold text-navy">Demo online payment</p><p class="mt-1 text-xs leading-5 text-muted">Real payment gateway is not connected. This simulates successful payment for the frontend prototype.</p></div>
  <div class="mt-5 grid grid-cols-2 gap-2"><button id="paymentBack" class="min-h-11 rounded-md border border-line text-sm font-bold text-navy">Back</button><button id="demoPay" class="min-h-11 rounded-md bg-brand text-sm font-bold text-white">Pay ${money(checkoutTotal())}</button></div>`;
  $("#paymentBack").onclick=()=>showStep(withDelivery?2:1);
  $("#demoPay").onclick=()=>completeCheckout("online");
}
function renderCOD(){
  const d=checkoutState.delivery;
  $("#checkoutStep3Body").innerHTML=`<div class="rounded-md border border-line p-5"><div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-xl text-green-600">✓</div><h3 class="mt-4 text-xl font-bold text-navy">Ready to place your order</h3><p class="mt-2 text-sm leading-6 text-muted">Cash on Delivery is enabled. No online payment is required now.</p><div class="mt-5 rounded-md bg-surface p-4 text-sm"><div class="flex justify-between"><span class="text-muted">Total</span><strong class="text-navy">${money(checkoutTotal())}</strong></div><div class="mt-2 flex justify-between"><span class="text-muted">Payment</span><strong class="text-navy">Cash on Delivery</strong></div><div class="mt-2 flex justify-between"><span class="text-muted">Phone</span><strong class="text-navy">${d?.phone||""}</strong></div></div></div><div class="mt-5 grid grid-cols-2 gap-2"><button id="codBack" class="min-h-11 rounded-md border border-line text-sm font-bold text-navy">Back</button><button id="confirmCOD" class="min-h-11 rounded-md bg-brand text-sm font-bold text-white">Confirm Order</button></div>`;
  $("#codBack").onclick=()=>showStep(2);$("#confirmCOD").onclick=()=>completeCheckout("cod");
}
function completeCheckout(method){
  const digital=isDigital()&&!checkoutState.fromCart,d=checkoutState.delivery;
  $("#successTitle").textContent=digital?"Payment successful":"Order confirmed";
  $("#successMessage").textContent=method==="cod"?"Your Cash on Delivery order is being processed.":digital?"Your payment was completed in this demo. The digital product is ready for the next delivery integration.":"Your payment was completed in this demo and your order has been received.";
  $("#successSummary").innerHTML=`<div class="flex justify-between"><span class="text-muted">Total</span><strong class="text-navy">${money(checkoutTotal())}</strong></div><div class="mt-2 flex justify-between"><span class="text-muted">Payment</span><strong class="text-navy">${method==="cod"?"Cash on Delivery":"Online Payment"}</strong></div>${d?`<div class="mt-3 border-t border-line pt-3"><p class="font-bold text-navy">${d.name}</p><p class="mt-1 text-xs text-muted">${d.phone}</p><p class="mt-1 text-xs text-muted">${d.district}, ${d.thana}</p><p class="mt-1 text-xs text-muted">${d.areaAddress}</p></div>`:`<p class="mt-3 border-t border-line pt-3 text-xs text-muted">Digital product — no delivery address required.</p>`}`;
  ["#checkoutStep1","#checkoutStep2","#checkoutStep3"].forEach(s=>$(s).classList.add("hidden"));$("#checkoutSuccess").classList.remove("hidden");checkoutState.step=3;$("#checkoutTitle").textContent="Complete";updateSteps();
  if(checkoutState.fromCart){cart=[];saveCart();renderCart();}
}
function buyNow(id){checkoutState={step:1,productId:Number(id),fromCart:false,delivery:null};openCheckout();showStep(1);}
function buyFromCart(){if(!cart.length)return;checkoutState={step:1,productId:null,fromCart:true,delivery:null};openCheckout();showStep(1);}

document.addEventListener("click",e=>{
  const product=e.target.closest("[data-product]");if(product){openProductModal(product.dataset.product);return;}
  const add=e.target.closest("[data-add]");if(add){e.stopPropagation();addToCart(add.dataset.add);return;}
  const buy=e.target.closest("[data-buy]");if(buy){e.stopPropagation();buyNow(buy.dataset.buy);return;}
  const remove=e.target.closest("[data-remove]");if(remove){removeFromCart(remove.dataset.remove);return;}
  const minus=e.target.closest("[data-minus]");if(minus){changeQty(minus.dataset.minus,-1);return;}
  const plus=e.target.closest("[data-plus]");if(plus){changeQty(plus.dataset.plus,1);return;}
  const cat=e.target.closest("[data-category]");if(cat){applyFilter({category:cat.dataset.category});return;}
  const nav=e.target.closest("[data-nav]");if(nav){if(nav.dataset.nav==="home")goHome();if(nav.dataset.nav==="shop")goShop();if(nav.dataset.nav==="digital")goType("digital");if(nav.dataset.nav==="physical")goType("physical");return;}
  if(e.target.closest("[data-close-modal]"))closeProductModal();
});

$("#mobileMenuBtn").onclick=()=>$("#mobileMenu").classList.toggle("hidden");
$("#mobileSearchBtn").onclick=()=>{$("#mobileSearchWrap").classList.toggle("hidden");if(!$("#mobileSearchWrap").classList.contains("hidden"))$("#mobileSearch").focus();};
$("#logoBtn").onclick=goHome;$("#heroShopBtn").onclick=goShop;$("#heroDigitalBtn").onclick=()=>goType("digital");
$("#cartBtn").onclick=openCart;$("#closeCartBtn").onclick=closeCart;$("#cartOverlay").onclick=closeCart;$("#checkoutBtn").onclick=buyFromCart;
$("#clearFilterBtn").onclick=clearFilters;$("#sortSelect").onchange=e=>{currentSort=e.target.value;renderFeatured();};$("#bestViewBtn").onclick=goShop;
$("#desktopSearch").oninput=e=>applyFilter({query:e.target.value.trim()});$("#mobileSearch").oninput=e=>applyFilter({query:e.target.value.trim()});
$("#productModal").onclick=e=>{if(e.target===$("#productModal"))closeProductModal();};
$("#closeCheckoutBtn").onclick=closeCheckout;
$("#checkoutNextFromProduct").onclick=()=>showStep(2);
$("#backToProduct").onclick=()=>showStep(1);
$("#deliveryForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget),d={name:String(f.get("name")||"").trim(),phone:String(f.get("phone")||"").trim(),district:String(f.get("district")||"").trim(),thana:String(f.get("thana")||"").trim(),areaAddress:String(f.get("areaAddress")||"").trim()};$("#phoneError").classList.add("hidden");$("#deliveryError").classList.add("hidden");if(!/^[0-9]{11}$/.test(d.phone)){$("#phoneError").classList.remove("hidden");$("#deliveryPhone").focus();return;}if(!d.name||!d.district||!d.thana||!d.areaAddress){$("#deliveryError").textContent="Please complete all delivery fields.";$("#deliveryError").classList.remove("hidden");return;}checkoutState.delivery=d;showStep(3);};
$("#deliveryPhone").oninput=e=>{e.target.value=e.target.value.replace(/\D/g,"").slice(0,11);$("#phoneError").classList.add("hidden");};
$("#closeSuccessBtn").onclick=()=>{closeCheckout();goShop();};
$("#checkoutModal").onclick=e=>{if(e.target===$("#checkoutModal"))closeCheckout();};

updateCartCount();renderFeatured();renderBest();renderDigital();
