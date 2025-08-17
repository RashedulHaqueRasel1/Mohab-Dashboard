import AddBlogs from '@/components/Dashboard/Blogs/AddBlogs/AddBlogs'
import React, { Suspense } from 'react'

export default function AddBlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddBlogs />
    </Suspense>
  )
}
