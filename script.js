// Khởi tạo giỏ hàng từ localStorage hoặc mảng rỗng nếu chưa có
let cart = JSON.parse(localStorage.getItem('saltyBreezeCart')) || [];

// Hàm lưu giỏ hàng vào localStorage
function saveCart() {
    localStorage.setItem('saltyBreezeCart', JSON.stringify(cart));
    updateCartUI();
}

// Bắt sự kiện click nút Add to Cart
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const name = e.target.getAttribute('data-name');
        const price = parseFloat(e.target.getAttribute('data-price'));
        const img = e.target.getAttribute('data-img');

        // Kiểm tra xem món này đã có trong giỏ chưa
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, img, quantity: 1 });
        }
        
        saveCart();
        alert(`Đã thêm ${name} vào giỏ hàng!`);
    });
});

// Hàm cập nhật giao diện giỏ hàng
function updateCartUI() {
    const cartContainer = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');
    const countElement = document.getElementById('cart-count');
    
    cartContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        count += item.quantity;

        // Render HTML với các class CSS mới
        cartContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <p class="name">${item.name}</p>
                    <p class="price">$${item.price} x ${item.quantity}</p>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Xóa</button>
            </div>
        `;
    });

    totalElement.innerText = total;
    countElement.innerText = count;
}

// Hàm xóa 1 món khỏi giỏ hàng
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

// Đóng mở giao diện Giỏ hàng
const cartModal = document.getElementById('cart-modal');
const cartOverlay = document.getElementById('cart-overlay');

function openCart() {
    cartModal.classList.add('open');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartModal.classList.remove('open');
    cartOverlay.classList.remove('active');
}

document.getElementById('cart-toggle-btn').addEventListener('click', openCart);
document.getElementById('close-cart-btn').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart); // Click ra ngoài màn hình mờ sẽ đóng giỏ hàng

// Xử lý Form Đặt hàng (Minh họa cho bài thuyết trình)
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Ngăn chặn trang bị reload
    
    if(cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    const name = document.getElementById('cus-name').value;
    alert(`Cảm ơn ${name}! Đơn hàng của bạn với tổng trị giá $${document.getElementById('cart-total').innerText} đã được ghi nhận hệ thống (Minh họa).`);
    
    // Xóa giỏ hàng sau khi đặt thành công
    cart = [];
    saveCart();
    document.getElementById('checkout-form').reset();
    closeCart(); // Tái sử dụng hàm đóng giỏ hàng để gỡ class 'open' ra
});

// Chạy hàm này khi trang vừa load xong để hiển thị số lượng giỏ hàng cũ
updateCartUI();


// Xử lý tính năng Đóng/Mở Thông tin sản phẩm
document.querySelectorAll('.info-toggle').forEach(function(btn) {
    
    // Gắn sự kiện click cho từng nút
    btn.addEventListener('click', function() {
        
        // 1. Tìm khối chứa lớn nhất của món ăn này
        const menuItem = this.closest('.menu-item');
        
        // 2. Từ khối lớn đó, tìm chính xác thẻ info-desc
        const desc = menuItem.querySelector('.info-desc');
        
        // Kiểm tra xem có tìm thấy thẻ desc không để tránh lỗi
        if (desc) {
            // Bật/tắt class 'show' để CSS hiển thị ra
            desc.classList.toggle('show');
            
            // Đổi chữ và mũi tên để giao diện trực quan hơn
            if (desc.classList.contains('show')) {
                this.innerHTML = 'Thu gọn ▴';
            } else {
                this.innerHTML = 'Thông tin sản phẩm ▾';
            }
        }
    });
    
});