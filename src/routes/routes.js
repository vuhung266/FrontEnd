// Pages
import Login from '~/pages/Login/Login';
import Home from '~/pages/Home';
import Page404 from '~/pages/Page404';
import QuanLyHDSD from '~/pages/QuanLyHeThong/ChiTietHDSD';
import QuanLyDanhMuc from '~/pages/QuanLyHeThong/QuanLyDanhMuc';
import ChiTietDanhMuc from '~/pages/QuanLyHeThong/QuanLyDanhMuc/ChiTietDanhMuc';
import Null from '~/layouts/Null';
// Public routes
const publicRoutes = [
    { path: '/login', component: Login, layout: Null },
    { path: '/', component: Home },
    { path: 'quan-ly-he-thong/chi-tiet-hdsd', component: QuanLyHDSD },
    { path: 'quan-ly-he-thong/quan-ly-danh-muc', component: QuanLyDanhMuc },
    { path: 'quan-ly-he-thong/chi-tiet-danh-muc/:id', component: ChiTietDanhMuc },
    { path: '/*', component: Page404, layout: Null},
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
