// Copied from Index.cshtml for static HTML version
const catalog = [
    {
        name: "Silk Sarees",
        products: [
            {
                code: "SR101",
                title: "Elegant Red Silk",
                price: 2499,
                originalPrice: 2999,
                images: ["images/Silk Sarees/Product_1.1.jpeg", "images/Silk Sarees/Product_1.10.jpg"],
                inStock: true
            },
            {
                code: "SR102",
                title: "Classic Blue Silk",
                price: 2599,
                originalPrice: 2999,
                images: ["images/Silk Sarees/Product_1.2.jpeg", "images/Silk Sarees/Product_1.11.jpg"],
                inStock: true
            },
            {
                code: "SR103",
                title: "Royal Green Zari Silk",
                price: 2599,
                images: ["images/Silk Sarees/Product_1.3.jpeg", "images/Silk Sarees/Product_1.12.jpg"],
                inStock: false // Out of stock demo
            },
            {
                code: "SR114",
                title: "Peach Blossom Silk",
                price: 2599,
                images: ["images/Silk Sarees/Product_1.4.jpg", "images/Silk Sarees/Product_1.13.jpg"],
                inStock: true
            },
            {
                code: "SR115",
                title: "Sunset Orange Banarasi",
                price: 2599,
                images: ["images/Silk Sarees/Product_1.5.jpg", "images/Silk Sarees/Product_1.14.jpeg"],
                inStock: true
            },
            {
                code: "SR116",
                title: "Midnight Blue Kanchipuram",
                price: 2599,
                images: ["images/Silk Sarees/Product_1.6.jpg", "images/Silk Sarees/Product_1.15.jpeg"],
                inStock: true
            },
            {
                code: "SR201",
                title: "Azure Blue Patola",
                price: 2599,
                images: ["images/Silk Sarees/Product_1.7.jpg", "images/Silk Sarees/Product_1.16.jpeg"],
                inStock: true
            },
            {
                code: "SR202",
                title: "Ivory Gold Tissue Silk",
                price: 2599,
                images: ["images/Silk Sarees/Product_1.8.jpg"],
                inStock: false // Out of stock demo
            },
            {
                code: "SR203",
                title: "Ruby Red Paithani",
                price: 2599,
                images: ["images/Silk Sarees/Product_1.9.jpg"],
                inStock: true
            }
        ]
    },
    {
        name: "Cotton Sarees",
        products: [
            {
                code: "CT301",
                title: "Festive Green Cotton",
                price: 1899,
                images: ["images/Cotton Sarees/Product_2.1.jpeg"],
                inStock: true
            },
            {
                code: "CT302",
                title: "Festive Green Cotton 3.2",
                price: 1899,
                images: ["images/Cotton Sarees/Product_2.2.jpeg"],
                inStock: true
            },
            {
                code: "CT303",
                title: "Festive Green Cotton 3.3",
                price: 1899,
                images: ["images/Cotton Sarees/Product_2.3.jpeg"],
                inStock: true
            }
        ]
    },
    {
        name: "Pattu Sarees",
        products: [
            {
                code: "PT501",
                title: "Royal Purple Pattu",
                price: 3999,
                images: ["images/Pattu Sarees/Product_3.1.jpeg"],
                inStock: true
            }
        ]
    }
];
const pageSize = 8;
let selectedCategory = catalog[0].name;
let currentPage = 1;
function renderCategories() {
    const catDiv = document.getElementById('category-buttons');
    catDiv.innerHTML = '';
    catalog.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary mb-2 mx-1' + (cat.name === selectedCategory ? ' active' : '');
        btn.textContent = cat.name;
        btn.onclick = () => { selectedCategory = cat.name; currentPage = 1; renderProducts(); renderCategories(); };
        catDiv.appendChild(btn);
    });
}
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    const cart = getCart();
    const el = document.getElementById('cart-count');
    if (el) el.textContent = cart.length;
}
function addToCart(product) {
    let cart = getCart();
    if (cart.length >= 10) {
        alert('You can add a maximum of 10 products to the cart.');
        return;
    }
    if (cart.find(item => item.code === product.code)) {
        return;
    }
    cart.push(product);
    setCart(cart);
    renderProducts();
}
function removeFromCart(productCode) {
    let cart = getCart();
    cart = cart.filter(item => item.code !== productCode);
    setCart(cart);
    renderProducts();
}
function renderProducts() {
    const cat = catalog.find(c => c.name === selectedCategory);
    // Only show products that are in stock
    const products = cat ? cat.products.filter(p => p.inStock !== false) : [];
    const grid = document.getElementById('product-grid');
    const title = document.getElementById('category-title');
    title.textContent = selectedCategory;
    grid.innerHTML = '';

    // Pagination
    const totalPages = Math.ceil(products.length / pageSize);
    const paged = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const cart = getCart();
    paged.forEach((saree, i) => {
        const col = document.createElement('div');
        col.className = 'col';
        const isAdded = cart.find(item => item.code === saree.code);
        col.innerHTML = `
        <div class="card h-100 shadow-sm border-0">
            <a href="#" data-bs-toggle="modal" data-bs-target="#productModal" onclick="showModal('${selectedCategory}',${(currentPage - 1) * pageSize + i})">
                <img src="${saree.images[0]}" class="product-img-square card-img-top mx-auto d-block" alt="${saree.title}" />
            </a>
            <div class="card-body p-2 text-center">
                <h5 class="card-title mb-1" style="font-size:1.1rem;">${saree.title}</h5>
                <div class="mb-1"><span class="badge bg-secondary">${saree.code}</span></div>
                <div class="fw-semibold text-success mb-1">
                    <span class="rupee">&#8377;</span>${saree.price}
                    ${saree.originalPrice && saree.originalPrice > saree.price
                        ? `<span class='text-muted' style='text-decoration:line-through;font-weight:400;font-size:0.95em;'><span class='rupee'>&#8377;</span>${saree.originalPrice}</span>`
                        : ""}
                </div>
                <button class="btn btn-sm ${isAdded ? 'btn-danger' : 'btn-outline-success'} mt-2" data-product-id="${saree.code}" onclick='${isAdded ? `removeFromCart("${saree.code}")` : `addToCart(${JSON.stringify(saree)})`}'>
                    ${isAdded ? 'Remove from Cart' : 'Add to Cart'}
                </button>
            </div>
        </div>`;
        grid.appendChild(col);
    });

    // Pagination nav
    const nav = document.getElementById('pagination-nav');
    nav.innerHTML = '';
    if (totalPages > 1) {
        let ul = document.createElement('ul');
        ul.className = 'pagination justify-content-center flex-wrap';
        // Pagination logic: show max 10 page numbers, with prev/next arrows
        let start = 1;
        let end = totalPages;
        if (totalPages > 10) {
            if (currentPage <= 6) {
                start = 1;
                end = 10;
            } else if (currentPage + 4 >= totalPages) {
                start = totalPages - 9;
                end = totalPages;
            } else {
                start = currentPage - 5;
                end = currentPage + 4;
            }
        }
        // Previous arrow
        let prevLi = document.createElement('li');
        prevLi.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
        let prevA = document.createElement('a');
        prevA.className = 'page-link';
        prevA.href = '#';
        prevA.innerHTML = '&laquo;';
        prevA.onclick = (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
                scrollToProducts();
            }
        };
        prevLi.appendChild(prevA);
        ul.appendChild(prevLi);
        // Page numbers
        for (let p = start; p <= end; p++) {
            let li = document.createElement('li');
            li.className = 'page-item' + (p === currentPage ? ' active' : '');
            let a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = p;
            a.onclick = (e) => {
                e.preventDefault();
                currentPage = p;
                renderProducts();
                scrollToProducts();
            };
            li.appendChild(a);
            ul.appendChild(li);
        }
        // Next arrow
        let nextLi = document.createElement('li');
        nextLi.className = 'page-item' + (currentPage === totalPages ? ' disabled' : '');
        let nextA = document.createElement('a');
        nextA.className = 'page-link';
        nextA.href = '#';
        nextA.innerHTML = '&raquo;';
        nextA.onclick = (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
                scrollToProducts();
            }
        };
        nextLi.appendChild(nextA);
        ul.appendChild(nextLi);
        nav.appendChild(ul);
        grid.style.marginBottom = '';
    } else {
        grid.style.marginBottom = '5rem';
    }
}
function scrollToProducts() {
    const mainContent = document.querySelector('.main-content-area');
    const nav = document.querySelector('.navbar');
    let navHeight = nav ? nav.offsetHeight : 56;
    if (window.innerWidth <= 576) navHeight = 32;
    const scrollTo = (mainContent?.offsetTop || 0) - navHeight - 4;
    window.scrollTo({ top: scrollTo > 0 ? scrollTo : 0, left: 0, behavior: 'smooth' });
}
window.showModal = function(category, index) {
    const cat = catalog.find(c => c.name === category);
    const saree = cat.products[index];
    document.getElementById('productModalLabel').textContent = saree.title + ' (' + saree.code + ')';
    document.getElementById('modal-price').innerHTML = 'Price: <span class="rupee">&#8377;</span>' + saree.price;
    const carouselInner = document.getElementById('modal-carousel-inner');
    carouselInner.innerHTML = '';
    saree.images.forEach((img, i) => {
        const div = document.createElement('div');
        div.className = 'carousel-item' + (i === 0 ? ' active' : '');
        div.innerHTML = `<img src="${img}" class="d-block mx-auto" style="width:350px;height:350px;object-fit:cover;" alt="${saree.title} image ${i+1}">`;
        carouselInner.appendChild(div);
    });
    // Reset carousel to first image
    // For static HTML, you may need to use Bootstrap's JS or a simple custom carousel
}
function populateCartProductIds() {
    const cart = getCart();
    const productIds = cart.map(item => item.code).join(', ');
    formState['entry.418389439'] = productIds;
}
document.addEventListener('DOMContentLoaded', function() {
    renderCategories();
    renderProducts();
    updateCartCount();
    // Only call populateCartProductIds if formState is defined
    if (typeof formState !== 'undefined') {
        populateCartProductIds();
    }
});
window.removeFromCart = removeFromCart;
