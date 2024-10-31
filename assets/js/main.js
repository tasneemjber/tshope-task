
const getCategories = async () => {
    const { data } = await axios.get('https://dummyjson.com/products/category-list');
    return data;
};


const displayCategories = async () => {
    const loader = document.querySelector(".loader-container");
    loader.classList.add("active");

    try {
        const categories = await getCategories();

        const result = categories.map((category) => {
            return `<div class='category'>
                <h2>${category}</h2>
                <a href='categoryDetails.html?category=${encodeURIComponent(category)}'>Details</a>
            </div>`;
        }).join('');

        document.querySelector(".categories .row").innerHTML = result;

    } catch (error) {
        console.error("Error loading categories:", error); 
        document.querySelector(".categories .row").innerHTML = "<p>Error loading categories</p>";
    } finally {
        loader.classList.remove("active"); 
    }
};


// Function to fetch products from API with pagination
const getProductsByPage = async (page) => {
    const skip = (page - 1) * 30; // Adjusted to 30 products per page
    const { data } = await axios.get(`https://dummyjson.com/products?limit=30&skip=${skip}`);
    return data;
};

// Function to display products and set up the modal
const displayProductsByPage = async (page = 1) => {
    const loader = document.querySelector(".loader-container");
    loader.classList.add("active");
    try {
        const data = await getProductsByPage(page);
        const numberOfPages = Math.ceil(data.total / 30);

        const result = data.products.map((product, index) => {
            return `
                <div class='product'>
                    <img src="${product.thumbnail}" alt="${product.description}" class="images" data-index="${index}" />
                    <h3>${product.title}</h3>
                    <span>${product.price}</span>
                </div>
            `;
        }).join(' ');
        document.querySelector(".products .row").innerHTML = result;

        setupPagination(page, numberOfPages);
        setupModal(data.products);

    } catch (error) {
        document.querySelector(".products .row").innerHTML = "<p>Error loading products</p>";
    } finally {
        loader.classList.remove("active");
    }
};


const setupPagination = (page, numberOfPages) => {
    let paginationLinks = ``;

  
    if (page == 1) {
        paginationLinks += `<li class="page-item"><button class="page-link" disabled>&laquo;</button></li>`;
    } else {
        paginationLinks += `<li class="page-item"><button onclick="displayProductsByPage(${page - 1})" class="page-link">&laquo;</button></li>`;
    }

    for (let i = 1; i <= numberOfPages; i++) {
        paginationLinks += `<li class="page-item ${i == page ? 'active' : ''}"><button onclick="displayProductsByPage(${i})" class="page-link">${i}</button></li>`;
    }

   
    if (page == numberOfPages) {
        paginationLinks += `<li class="page-item"><button class="page-link" disabled>&raquo;</button></li>`;
    } else {
        paginationLinks += `<li class="page-item"><button onclick="displayProductsByPage(${page + 1})" class="page-link">&raquo;</button></li>`;
    }

    document.querySelector(".pagination").innerHTML = paginationLinks;
};


const setupModal = (products) => {
    const modal = document.querySelector(".my-modal");
    const closeBtn = document.querySelector(".close-btn");
    const leftBtn = document.querySelector(".left-btn");
    const rightBtn = document.querySelector(".right-btn");
    const modalImage = modal.querySelector("img");
    let currentIndex = 0;


    document.querySelectorAll(".images").forEach((img) => {
        img.addEventListener("click", (e) => {
            currentIndex = parseInt(e.target.getAttribute("data-index"));
            modalImage.src = products[currentIndex].thumbnail;
            modal.classList.remove("d-none");
        });
    });

   
    closeBtn.addEventListener("click", () => {
        modal.classList.add("d-none");
    });
    leftBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + products.length) % products.length;
        modalImage.src = products[currentIndex].thumbnail;
    });


    rightBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % products.length;
        modalImage.src = products[currentIndex].thumbnail;
    });
};



displayCategories();
displayProductsByPage();

window.onscroll = function () {
    const nav = document.querySelector(".header");
    const categories = document.querySelector(".products");
    if (window.scrollY > categories.offsetTop) {
        nav.classList.add("scrollNavbar");
    } else {
        nav.classList.remove("scrollNavbar");
    }
};