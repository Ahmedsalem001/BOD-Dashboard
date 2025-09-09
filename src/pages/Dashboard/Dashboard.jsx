import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEntries,
  addEntry,
  updateEntry,
  deleteEntry,
} from "../../features/entries/entriesSlice";
import { useTable } from "../../hooks/useTable";
import { useForm } from "../../hooks/useForm";
import { useNotifications } from "../../hooks/useNotifications";
import { usePerformance } from "../../hooks/usePerformance";
import Table from "../../components/Table/Table";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Button from "../../components/Button";
import Modal from "../../components/Modal/Modal";
import { formatDate } from "../../utils/formatDate";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { showSuccess, showError } = useNotifications();
  usePerformance("Dashboard");

  // Redux state
  const {
    items: entries,
    loading,
    error,
  } = useSelector((state) => state.entries);

  // Table hook
  const table = useTable(entries, { searchFields: ["title", "body"] });

  // Form hook
  const form = useForm(
    { title: "", body: "" },
    {
      title: { required: "Title is required" },
      body: { required: "Content is required" },
    }
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState(null);

  // Fetch entries on mount
  useEffect(() => {
    dispatch(fetchEntries());
  }, [dispatch]);

  // Memoized table columns configuration
  const columns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        headerClassName: "w-16",
        cellClassName: "font-mono text-sm",
      },
      {
        key: "title",
        title: "Title",
        render: (value) => (
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
        key: "body",
        title: "Content",
        render: (value) => (
          <div className="max-w-md">
            <p
              className="text-sm text-gray-600 dark:text-gray-300 truncate"
              title={value}
            >
              {value}
            </p>
          </div>
        ),
      },
      {
        key: "userId",
        title: "User ID",
        headerClassName: "w-20",
        cellClassName: "text-center",
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
    ],
    []
  );

  // Memoized event handlers
  const handleAddEntry = useCallback(() => {
    setEditingEntry(null);
    form.reset({ title: "", body: "" });
    setIsModalOpen(true);
  }, [form]);

  const handleEditEntry = useCallback(
    (entry) => {
      setEditingEntry(entry);
      form.setValues({ title: entry.title || "", body: entry.body || "" });
      setIsModalOpen(true);
    },
    [form]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!form.validate()) return;

      try {
        if (editingEntry) {
          await dispatch(
            updateEntry({ id: editingEntry.id, ...form.values })
          ).unwrap();
          showSuccess("Entry updated successfully");
        } else {
          await dispatch(addEntry(form.values)).unwrap();
          showSuccess("Entry created successfully");
        }
        setIsModalOpen(false);
        form.reset();
      } catch (error) {
        showError(error.message || "An error occurred");
      }
    },
    [editingEntry, form, dispatch, showSuccess, showError]
  );

  const handleDeleteEntry = useCallback(
    async (entry) => {
      if (window.confirm("Are you sure you want to delete this entry?")) {
        try {
          await dispatch(deleteEntry(entry.id)).unwrap();
          showSuccess("Entry deleted successfully");
        } catch (error) {
          showError(error.message || "An error occurred");
        }
      }
    },
    [dispatch, showSuccess, showError]
  );

  const handleRowClick = useCallback(
    (entry) => {
      handleEditEntry(entry);
    },
    [handleEditEntry]
  );

  // Memoized stats calculations
  const stats = useMemo(
    () => ({
      total: entries.length,
      published: entries.filter((entry) => entry.status === "published").length,
      drafts: entries.filter((entry) => entry.status === "draft").length,
    }),
    [entries]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your entries
          </p>
        </div>
        <Button onClick={handleAddEntry}>Add New Entry</Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={table.searchTerm}
            onChange={table.setSearchTerm}
            placeholder="Search entries..."
          />
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={table.itemsPerPage}
            onChange={(e) => table.setItemsPerPage(e.target.value)}
            className="form-input"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Entries
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Published
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {stats.published}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Drafts
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {stats.drafts}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        data={table.data}
        columns={columns}
        loading={loading}
        emptyMessage="No entries found. Try adjusting your search criteria."
        onRowClick={handleRowClick}
      />

      {/* Pagination */}
      {table.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={table.currentPage}
            totalPages={table.totalPages}
            onPageChange={table.setCurrentPage}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEntry ? "Edit Entry" : "Add New Entry"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={form.values.title}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={`form-input ${
                form.errors.title ? "border-red-500" : ""
              }`}
              placeholder="Enter title..."
            />
            {form.errors.title && (
              <p className="form-error">{form.errors.title}</p>
            )}
          </div>

          <div>
            <label className="form-label">Content</label>
            <textarea
              name="body"
              value={form.values.body}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={`form-input ${
                form.errors.body ? "border-red-500" : ""
              }`}
              rows={4}
              placeholder="Enter content..."
            />
            {form.errors.body && (
              <p className="form-error">{form.errors.body}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!form.isValid}>
              {editingEntry ? "Update Entry" : "Create Entry"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
