import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/api';
import toast from 'react-hot-toast';
import Editor from '../components/Editor';

function NewArticle({ selectedCategory, selectedNotebook }) {
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState(null);
  const navigate = useNavigate();

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      const newArticle = await createArticle({
        title: articleTitle,
        content: articleContent,
        category: selectedCategory.id,
        notebook: selectedNotebook.id
      });
      toast.success('Article created successfully!');
      navigate(`/article/${newArticle.id}`);
    } catch (error) {
      toast.error('Failed to create article');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="p-8">
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
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewArticle;
