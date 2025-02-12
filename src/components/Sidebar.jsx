import { useState, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { PlusIcon, ChevronDownIcon, ChevronRightIcon, PencilIcon, TrashIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { getNotebooks, createNotebook, getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

function Sidebar({ onCategorySelect, selectedNotebook, setSelectedNotebook, selectedCategory, onLogout }) {
  const [isAddingNotebook, setIsAddingNotebook] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [notebooks, setNotebooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [newCategoryParentId, setNewCategoryParentId] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotebooks();
  }, []);

  useEffect(() => {
    if (selectedNotebook) {
      fetchCategories();
    }
  }, [selectedNotebook]);

  const fetchNotebooks = async () => {
    try {
      const data = await getNotebooks();
      setNotebooks(data);
      if (data.length > 0 && !selectedNotebook) {
        setSelectedNotebook(data[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch notebooks');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      const notebookCategories = data.filter(
        category => category.notebook === selectedNotebook.id
      );
      setCategories(notebookCategories);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleAddNotebook = async (e) => {
    e.preventDefault();
    try {
      const newNotebook = await createNotebook(newNotebookName);
      setNotebooks([...notebooks, newNotebook]);
      setNewNotebookName('');
      setIsAddingNotebook(false);
      toast.success('Notebook created successfully!');
    } catch (error) {
      toast.error('Failed to create notebook');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const newCategory = await createCategory({
        name: newCategoryName,
        parent: newCategoryParentId,
        notebook: selectedNotebook.id
      });
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setIsAddingCategory(false);
      setNewCategoryParentId(null);
      closeAddCategoryModal();
      toast.success('Category created successfully!');
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const updatedCategory = await updateCategory(categoryToEdit.id, {
        ...categoryToEdit,
        name: newCategoryName,
      });
      setCategories(categories.map(category =>
        category.id === updatedCategory.id ? updatedCategory : category
      ));
      setNewCategoryName('');
      setIsEditingCategory(false);
      setCategoryToEdit(null);
      closeEditCategoryModal();
      toast.success('Category updated successfully!');
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete);
      setCategories(categories.filter(category => category.id !== categoryToDelete));
      toast.success('Category deleted successfully!');
      closeDeleteCategoryModal();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    onLogout();
    setSelectedNotebook(null);
    onCategorySelect(null);
    navigate('/login');
  };

  const openAddCategoryModal = (parentId) => {
    setNewCategoryParentId(parentId);
    setShowAddCategoryModal(true);
  };

  const closeAddCategoryModal = () => {
    setShowAddCategoryModal(false);
    setNewCategoryName('');
    setNewCategoryParentId(null);
  };

  const openEditCategoryModal = (category) => {
    setCategoryToEdit(category);
    setNewCategoryName(category.name);
    setShowEditCategoryModal(true);
  };

  const closeEditCategoryModal = () => {
    setShowEditCategoryModal(false);
    setNewCategoryName('');
    setCategoryToEdit(null);
  };

  const openDeleteCategoryModal = (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowDeleteCategoryModal(true);
  };

  const closeDeleteCategoryModal = () => {
    setShowDeleteCategoryModal(false);
    setCategoryToDelete(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderCategories = (parentId = null) => {
    const categoryItems = categories.filter(category => category.parent === parentId);

    if (categoryItems.length === 0) return null;

    return (
      <ul className="pl-4">
        {categoryItems.map(category => {
          
          return (
            <li key={category.id} className="py-1">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`flex items-center space-x-2 'text-gray-700' ${selectedCategory?.id === category.id ? 'font-bold' : ''}`}
                >
                  
                  <span>{category.name}</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditCategoryModal(category)}
                    className="p-1 text-gray-600 hover:text-indigo-600"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteCategoryModal(category.id)}
                    className="p-1 text-gray-600 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openAddCategoryModal(category.id)}
                    className="p-1 text-gray-600 hover:text-indigo-600"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {renderCategories(category.id)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-64 bg-white shadow-md flex flex-col">
      {/* <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Knowledge Base</h1>
        <button onClick={toggleMobileMenu} className="lg:hidden">
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div> */}

      <div className="p-4">
        <Menu as="div" className="relative">
          <Menu.Button className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">
            {selectedNotebook ? selectedNotebook.name : 'Select Notebook'}
          </Menu.Button>
          <Menu.Items className="absolute w-full mt-2 origin-top-right bg-white rounded-md shadow-lg">
            <div className="py-1">
              {notebooks.map((notebook) => (
                <Menu.Item key={notebook.id}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } w-full text-left px-4 py-2 text-sm text-gray-700`}
                      onClick={() => {
                        setSelectedNotebook(notebook);
                        onCategorySelect(null);
                      }}
                    >
                      {notebook.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } w-full text-left px-4 py-2 text-sm text-indigo-600`}
                    onClick={() => setIsAddingNotebook(true)}
                  >
                    <PlusIcon className="inline w-4 h-4 mr-2" />
                    Add Notebook
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>

      {isAddingNotebook && (
        <div className="p-4">
          <form onSubmit={handleAddNotebook}>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Notebook name"
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              required
            />
            <div className="mt-2 flex space-x-2">
              <button
                type="submit"
                className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNotebook(false)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {selectedNotebook && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Categories</h3>
              <button
                onClick={() => openAddCategoryModal(null)}
                className="px-2 py-1 text-xs text-gray-600 hover:text-indigo-600"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            {renderCategories()}
          </div>
        )}
      </div>

      {/* Modal for adding a new category */}
      
      {/* <Modal isOpen={showAddCategoryModal} onClose={closeAddCategoryModal}> */}
      {showAddCategoryModal?
        <div style={{position:"absolute", zIndex:100, backgroundColor:"white", width:'100%', height:"100vh", padding:"10px"}}>
        <h3 className="text-lg font-medium text-gray-900">Add New Category</h3>
        <form onSubmit={handleAddCategory} className="mt-4">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md mb-4"
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={closeAddCategoryModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
        :<></>
      }
      {/* </Modal> */}

      {/* Modal for editing a category */}
      {/* <Modal isOpen={showEditCategoryModal} onClose={closeEditCategoryModal}> */}
      {showEditCategoryModal?
        <div style={{position:"absolute", zIndex:100, backgroundColor:"white", width:'100%', height:"100vh", padding:"10px"}}>
        <h3 className="text-lg font-medium text-gray-900">Edit Category</h3>
        <form onSubmit={handleUpdateCategory} className="mt-4">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md mb-4"
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={closeEditCategoryModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>:<></>}
      
      {/* // </Modal> */}

      {/* Modal for deleting a category */}
      {/* <Modal isOpen={showDeleteCategoryModal} onClose={closeDeleteCategoryModal}> */}
      {showDeleteCategoryModal?
        <div style={{position:"absolute", zIndex:100, backgroundColor:"white", width:'100%', height:"100vh", padding:"10px"}}>
        <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={closeDeleteCategoryModal}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteCategory}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            Delete
          </button>
        </div>
        </div>:<></>
        }
      {/* </Modal> */}

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
