import React, { useEffect, useMemo, useCallback } from "react";
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
  selectFilteredEntries,
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
import StatsCard from "../components/StatsCard";
import Icon from "../components/Icon";
import { formatDate } from "../utils/formatDate";

const Dashboard = () => {
  const dispatch = useDispatch();
  const entries = useSelector(selectAllEntries);
  const loading = useSelector(selectEntriesLoading);
  const error = useSelector(selectEntriesError);
  const searchTerm = useSelector(selectSearchTerm);
  const currentPage = useSelector(selectCurrentPage);
  const itemsPerPage = useSelector(selectItemsPerPage);
  const { entries: paginatedEntries, totalPages } = useSelector(
    selectPaginatedEntries
  );

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState(null);
  const [formData, setFormData] = React.useState({
    title: "",
    body: "",
  });

  // Fetch entries on component mount
  useEffect(() => {
    dispatch(fetchEntries());
  }, [dispatch]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isModalOpen) {
      setFormData({ title: "", body: "" });
      setEditingEntry(null);
    }
  }, [isModalOpen]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearch = useCallback(
    (term) => {
      dispatch(setSearchTerm(term));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (page) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const handleItemsPerPageChange = useCallback(
    (itemsPerPage) => {
      dispatch(setItemsPerPage(parseInt(itemsPerPage)));
    },
    [dispatch]
  );

  // Memoized handlers for modal operations
  const handleAddEntry = useCallback(() => {
    setEditingEntry(null);
    setFormData({ title: "", body: "" });
    setIsModalOpen(true);
  }, []);

  const handleEditEntry = useCallback((entry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title || "",
      body: entry.body || "",
    });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setFormData({ title: "", body: "" });
  }, []);

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
            message: "Entry updated successfully",
          })
        );
      } else {
        await dispatch(addEntry(formData)).unwrap();
        dispatch(
          showSuccessNotification({
            type: "success",
            message: "Entry created successfully",
          })
        );
      }
      handleCloseModal();
    } catch (error) {
      dispatch(
        showErrorNotification({
          type: "error",
          message: editingEntry
            ? "Failed to update entry"
            : "Failed to create entry",
        })
      );
    }
  };

  // Memoized handlers for form and actions
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleDeleteEntry = useCallback(
    async (entry) => {
      if (window.confirm("Are you sure you want to delete this entry?")) {
        try {
          await dispatch(deleteEntry(entry.id)).unwrap();
          dispatch(
            showSuccessNotification({
              type: "success",
              message: "Entry deleted successfully",
            })
          );
        } catch (error) {
          dispatch(
            showErrorNotification({
              type: "error",
              message: "Failed to delete entry",
            })
          );
        }
      }
    },
    [dispatch]
  );

  const handleRowClick = useCallback(
    (entry) => {
      handleEditEntry(entry);
    },
    [handleEditEntry]
  );

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
              aria-label={`Edit entry: ${row.title}`}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteEntry(row)}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              aria-label={`Delete entry: ${row.title}`}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleEditEntry, handleDeleteEntry]
  );

  // Use optimized selectors for filtered and paginated data
  const { entries: paginatedData, totalPages: totalPagesCalculated } =
    useSelector(selectPaginatedEntries);
  const filteredEntries = useSelector(selectFilteredEntries);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your posts and entries</p>
        </div>
        <Button onClick={handleAddEntry}>Add New Entry</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Entries"
          value={entries.length}
          icon={<Icon name="posts" />}
          iconColor="primary"
        />
        <StatsCard
          title="Filtered Results"
          value={filteredEntries.length}
          icon={<Icon name="check" />}
          iconColor="green"
        />
        <StatsCard
          title="Current Page"
          value={`${currentPage} / ${totalPagesCalculated}`}
          icon={<Icon name="clock" />}
          iconColor="yellow"
        />
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search entries..."
              className="w-full sm:w-96"
            />

            <div className="flex items-center space-x-4">
              <label
                htmlFor="items-per-page"
                className="text-sm font-medium text-gray-700"
              >
                Show:
              </label>
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="form-input w-20"
                aria-label="Items per page"
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
            <div className="flex items-center text-red-600">
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
              <span>Error loading entries: {error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <Table
        data={paginatedData}
        columns={columns}
        loading={loading}
        emptyMessage="No entries found. Try adjusting your search criteria."
        onRowClick={handleRowClick}
      />

      {/* Pagination */}
      {totalPagesCalculated > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPagesCalculated}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEntry ? "Edit Entry" : "Add New Entry"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="entry-title" className="form-label">
              Title
            </label>
            <input
              id="entry-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter title..."
              required
              aria-describedby="title-help"
            />
            <div id="title-help" className="form-help">
              Enter a descriptive title for your entry
            </div>
          </div>
          <div>
            <label htmlFor="entry-content" className="form-label">
              Content
            </label>
            <textarea
              id="entry-content"
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              className="form-input"
              rows={4}
              placeholder="Enter content..."
              required
              aria-describedby="content-help"
            />
            <div id="content-help" className="form-help">
              Provide detailed content for your entry
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit">{editingEntry ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
