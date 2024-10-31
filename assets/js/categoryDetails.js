
const getProductsByCategory = async () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category'); 
    const { data } = await axios.get(`https://dummyjson.com/products/category/${category}`);
    return data;
};

const displayCategoryProducts = async () => {
    const loader = document.querySelector(".loader-container");
    loader.style.display = "block"; 
    try {
        const data = await getProductsByCategory();
        const result = data.products.map((product) => {
            return `
                <div class='product'>
                    <img src="${product.thumbnail}" alt="${product.description}" />
                    <h3>${product.title}</h3>
                    <span>$${product.price.toFixed(2)}</span>
                </div>
            `;
        }).join('');
        document.querySelector(".products .row").innerHTML = result;
    } catch (error) {
        console.error("Error loading products:", error);
        document.querySelector(".products .row").innerHTML = "<p>Error loading products</p>";
    } finally {
        loader.style.display = "none"; 
    }
};


    displayCategoryProducts();
