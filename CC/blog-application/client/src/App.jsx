import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Blog from './pages/Blog'
import PostDetail from './pages/PostDetail'
import CategoryPage from './pages/CategoryPage'
import Categories from './pages/Categories'
import SearchResults from './pages/SearchResults'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import ManagePosts from './pages/admin/ManagePosts'
import PostForm from './pages/admin/PostForm'
import ManageCategories from './pages/admin/ManageCategories'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<ManagePosts />} />
          <Route path="posts/new" element={<PostForm />} />
          <Route path="posts/edit/:id" element={<PostForm />} />
          <Route path="categories" element={<ManageCategories />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
