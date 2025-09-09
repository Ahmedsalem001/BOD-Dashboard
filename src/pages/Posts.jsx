import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEntries,
  selectAllEntries,
  selectEntriesLoading,
  selectEntriesError,
  selectSearchTerm,
  selectCurrentPage,
  selectItemsPerPage,
  selectPaginatedEntries,
  setSearchTerm,
  setCurrentPage,
  setItemsPerPage,
  addEntry,
  updateEntry,
  deleteEntry,
} from "../features/entries/entriesSlice";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../features/notifications/notificationsSlice";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { formatDate } from "../utils/formatDate";

const Posts = () => {
  const dispatch = useDispatch();
  const entries = useSelector(selectAllEntries);
  const loading = useSelector(selectEntriesLoading);
  const error = useSelector(selectEntriesError);
  const searchTerm = useSelector(selectSearchTerm);
  const currentPage = useSelector(selectCurrentPage);
  const itemsPerPage = useSelector(selectItemsPerPage);
  const {
    entries: paginatedEntries,
    totalPages,
    totalItems,
  } = useSelector(selectPaginatedEntries);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tags: [],
  });

  // Fetch entries on component mount
  useEffect(() => {
    dispatch(fetchEntries());
  }, [dispatch]);

  // Handle search
  const handleSearch = (term) => {
    dispatch(setSearchTerm(term));
  };

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  // Handle items per page change
  const handleItemsPerPageChange = (itemsPerPage) => {
    dispatch(setItemsPerPage(parseInt(itemsPerPage)));
  };

  // Handle add new entry
  const handleAddEntry = () => {
    setEditingEntry(null);
    setFormData({ title: "", body: "", tags: [] });
    setIsModalOpen(true);
  };

  // Handle edit entry
  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title || "",
      body: entry.body || "",
      tags: entry.tags || [],
    });
    setIsModalOpen(true);
  };

  // Handle delete entry
  const handleDeleteEntry = async (entry) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await dispatch(deleteEntry(entry.id)).unwrap();
        dispatch(
          showSuccessNotification({
            type: "success",
            message: "Post deleted successfully",
          })
        );
      } catch (error) {
        dispatch(
          showErrorNotification({
            type: "error",
            message: "Failed to delete post",
          })
        );
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEntry) {
        await dispatch(
          updateEntry({ id: editingEntry.id, ...formData })
        ).unwrap();
        dispatch(
          showSuccessNotification({
            type: "success",
            message: "Post updated successfully",
          })
        );
      } else {
        await dispatch(addEntry(formData)).unwrap();
        dispatch(
          showSuccessNotification({
            type: "success",
            message: "Post created successfully",
          })
        );
      }
      setIsModalOpen(false);
      setFormData({ title: "", body: "", tags: [] });
    } catch (error) {
      dispatch(
        showErrorNotification({
          type: "error",
          message: editingEntry
            ? "Failed to update post"
            : "Failed to create post",
        })
      );
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle row click
  const handleRowClick = (entry) => {
    handleEditEntry(entry);
  };

  // Table columns configuration
  const columns = [
    {
      key: "id",
      title: "ID",
      headerClassName: "w-16",
      cellClassName: "font-mono text-sm",
    },
    {
      key: "title",
      title: "Title",
      render: (value, row) => (
        <div className="max-w-xs">
          <p
            className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
            title={value}
          >
            {value}
          </p>
        </div>
      ),
    },
    {
      key: "excerpt",
      title: "Excerpt",
      render: (value, row) => (
        <div className="max-w-md">
          <p
            className="text-sm text-gray-600 dark:text-gray-400 truncate"
            title={value}
          >
            {value}
          </p>
        </div>
      ),
    },
    {
      key: "author",
      title: "Author",
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <img
            src={value?.avatar}
            alt={value?.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {value?.name}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === "published"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : value === "draft"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "views",
      title: "Views",
      headerClassName: "w-20",
      cellClassName: "text-center",
    },
    {
      key: "createdAt",
      title: "Created",
      render: (value) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      headerClassName: "w-32",
      cellClassName: "text-center",
      render: (_, row) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handleEditEntry(row)}
            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteEntry(row)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your blog posts and articles
          </p>
        </div>
        <Button onClick={handleAddEntry}>Create New Post</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Posts
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {entries.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Published
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {
                    entries.filter((entry) => entry.status === "published")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Drafts
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {entries.filter((entry) => entry.status === "draft").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Views
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {entries
                    .reduce((sum, entry) => sum + (entry.views || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search posts..."
              className="w-full sm:w-96"
            />

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show:
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="form-input w-20"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="card">
          <div className="card-body">
            <div className="flex items-center text-red-600 dark:text-red-400">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Error loading posts: {error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <Table
        data={paginatedEntries}
        columns={columns}
        loading={loading}
        emptyMessage="No posts found. Try adjusting your search criteria."
        onRowClick={handleRowClick}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEntry ? "Edit Post" : "Create New Post"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter post title..."
              required
            />
          </div>
          <div>
            <label className="form-label">Content</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              className="form-input"
              rows={6}
              placeholder="Enter post content..."
              required
            />
          </div>
          <div>
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={
                Array.isArray(formData.tags)
                  ? formData.tags.join(", ")
                  : formData.tags
              }
              onChange={(e) => {
                const tags = e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag);
                setFormData((prev) => ({ ...prev, tags }));
              }}
              className="form-input"
              placeholder="e.g., technology, programming, react"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingEntry ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Posts;
