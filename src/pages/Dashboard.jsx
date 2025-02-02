import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getArticles, createArticle, deleteArticle } from '../services/api';
import toast from 'react-hot-toast';
import Editor from '../components/Editor';
import Modal from '../components/Modal';

function Dashboard({ selectedCategory, selectedNotebook }) {
  const [articles, setArticles] = useState([]);
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCategory) {
      fetchArticles();
    }
  }, [selectedCategory]);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      const categoryArticles = data.filter(
        article => article.category === selectedCategory.id
      );
      setArticles(categoryArticles);
    } catch (error) {
      toast.error('Failed to fetch articles');
    }
  };

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      const newArticle = await createArticle({
        title: articleTitle,
        content: articleContent,
        category: selectedCategory.id,
        notebook: selectedNotebook.id
      });
      setArticles([...articles, newArticle]);
      setArticleTitle('');
      setArticleContent(null);
      setIsAddingArticle(false);
      toast.success('Article created successfully!');
      navigate(`/article/${newArticle.id}`);
    } catch (error) {
      toast.error('Failed to create article');
    }
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    try {
      await deleteArticle(articleToDelete);
      setArticles(articles.filter(article => article.id !== articleToDelete));
      toast.success('Article deleted successfully!');
      setShowDeleteModal(false);
      setArticleToDelete(null);
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleArticleClick = (article) => {
    navigate(`/article/${article.id}`);
  };

  const confirmDelete = (articleId) => {
    setArticleToDelete(articleId);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  };

  const handleAddArticleClick = () => {
    navigate('/article/new');
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {selectedCategory ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory.name}
            </h2>
            <button
              onClick={handleAddArticleClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Add Article
            </button>
          </div>

          {isAddingArticle ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={handleAddArticle}>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md mb-4"
                  placeholder="Article title"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  required
                />
                <Editor
                  data={articleContent}
                  onChange={setArticleContent}
                />
                <div className="mt-4 flex space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingArticle(false);
                      setArticleTitle('');
                      setArticleContent(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              {articles.map(article => (
                <div
                  key={article.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{article.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => confirmDelete(article.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleArticleClick(article)}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    Read more
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500">Select a category to view articles</p>
        </div>
      )}

      <Modal isOpen={showDeleteModal} onClose={cancelDelete}>
        <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this article? This action cannot be undone.
          </p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={cancelDelete}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteArticle}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;
