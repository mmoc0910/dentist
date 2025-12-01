export const statusLaboColor = (status) => {
    let color = ""
  switch (status) {
    case 1:
      color = "#0288d1";
      break;
    case 2:
      color = "#e18220";
      break;
    case 3:
      color = "#2e7d32";
      break;
    case 4:
      color = "#7b41e1";
      break;
    case 5:
      color = "#eb2525";
      break;
    case 6:
      color = "#2e7d32";
      break;
  }
  return color;
};
export const statusLaboFormatter = (status) => {
  let text = "";
  switch (status) {
    case 1:
      text = "Đã chuẩn bị gửi";
      break;
    case 2:
      text = "Labo nhận mẫu";
      break;
    case 3:
      text = "Labo giao mẫu";
      break;
    case 4:
      text = "Đang sử dụng";
      break;
    case 5:
      text = "Mẫu lỗi chờ gửi lại";
      break;
    case 6:
      text = "Hoàn thành";
      break;
  }
  return text;
};
