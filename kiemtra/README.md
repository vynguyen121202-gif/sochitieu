# Bộ kiểm tra và máy chủ xem thử

`app.js` chạy được dưới Node với DOM giả, nên kiểm tra được từng con số mà
không cần mở trình duyệt. Tiền lệ và cách làm ghi trong `CLAUDE.md`.

## Chạy kiểm tra

```
node kiemtra/chay-tat-ca.js
```

| File | Kiểm cái gì |
|---|---|
| `kt-tongquan.js` | Tab Tổng quan: công thức, thứ tự khối, màu, nền, tháng cũ |
| `kt-nhap-tong.js` | Tab Nhập: dòng tổng, chọn / bỏ chọn tất cả |
| `kt-nhap-loi.js` | Tab Nhập: báo dòng dán hỏng, câu lệnh AI ở Cài đặt |
| `kt-nhac-ghi-so.js` | Khối nhắc khi sổ lâu chưa cập nhật |

Mỗi bài dựng `Date` giả nên kết quả không đổi theo ngày chạy.
`so-mau.js` sinh sổ mẫu bằng hạt giống cố định — chạy bao nhiêu lần cũng ra
đúng một sổ, nên số liệu trong bài kiểm tra so sánh được.

## Xem thử trên trình duyệt

```
node kiemtra/server-so-that.js    # cổng 8765 — SỔ THẬT của Vy
node kiemtra/server-so-mau.js     # cổng 8767 — sổ mẫu, mở /nap một lần để nạp
```

Hai cổng khác nhau là **cố ý**: kho dữ liệu của trình duyệt tách theo cổng,
nên nghịch sổ mẫu ở 8767 không bao giờ đụng được vào sổ thật ở 8765, cũng
không đụng bản trên điện thoại.

Sổ mẫu cố ý để trống 3 ngày gần nhất để thấy khối nhắc ghi sổ.

## Xem thử bản đang thiết kế lại (phiên 2026-09-27)

```
node kiemtra/server-soi-so.js     # cổng 8790 — app NGUYÊN BẢN + trang soi số
node kiemtra/server-ban-thu.js    # cổng 8791 — app đã VÁ TRONG BỘ NHỚ
```

**Không file nào trong dự án bị sửa.** `server-ban-thu.js` đọc `app.js` và
`style.css` rồi vá chuỗi lúc phục vụ, nên `app.js` vẫn nguyên v=7.

| Đường dẫn | Xem gì |
|---|---|
| `8790/soi` | Bảng soi: mọi con số app đọc ra từ sổ thật, có kiểm chéo sao kê |
| `8790/phac` | Phác thảo giao diện — 4 kịch bản, chuyển màn sáng/tối |
| `8790/tq` | App nguyên bản, sổ thật nạp sẵn |
| `8790/cuoithang` | App nguyên bản, đồng hồ giả lập 30/09 |
| `8790/dongso` | App nguyên bản, đồng hồ giả lập 05/10 — tháng 9 đã đóng sổ |
| `8791/` | Bản vá, sổ thật |
| `8791/hen` | Bản vá, bản sao sổ có điền sẵn ngày dự kiến thu |

`server-soi-so.js` giả lập đồng hồ bằng cách thay `window.Date` bằng một
inline script chạy trước `app.js`. App chặn không cho xem tháng tương lai
nên đó là cách duy nhất tới được màn tháng đã đóng sổ.

`phac-thao-tongquan.html` mở trực tiếp bằng trình duyệt cũng được, không cần máy chủ.

> **`server-soi-so.js` và `phac-thao-tongquan.html` nằm trong `.gitignore`** — hai file này có
> số liệu thật và tên người nhà nướng sẵn bên trong (lương từng kỳ, số dư từng nguồn, tên các
> khoản cho vay), mà kho này công khai. Chúng vẫn ở trên máy và chạy bình thường, chỉ không
> được đẩy lên GitHub. `server-ban-thu.js` thì đã dọn sạch, không mang dữ liệu riêng nào.

## Khi thêm công thức mới

Theo rule `.claude/rules/calculations.md`: đưa ví dụ bằng số cho Vy duyệt
trước, viết code sau, rồi thêm điểm kiểm vào đây và cập nhật mảng `R` trong
`vInfo()`. Bài kiểm tra nên có cả **điểm canh ngược** — thứ gì KHÔNG được
xuất hiện — vì phần lớn lỗi bắt được trong dự án này là loại đó.
