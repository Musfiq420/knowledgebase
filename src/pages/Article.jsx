import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticle, getComments, createComment, updateArticle } from '../services/api';
import Editor from '../components/Editor';
import { PencilIcon } from '@heroicons/react/24/outline';

function Article() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(null);
	const [articleTitle, setArticleTitle] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(articleId);
        setArticle(data);
        setEditedContent(data.content);
				setArticleTitle(data.title);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const data = await getComments(articleId);
        setComments(data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    if (articleId) {
      fetchArticle();
      fetchComments();
    }
  }, [articleId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const comment = await createComment(articleId, newComment);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedArticle = await updateArticle(articleId, {
        ...article,
				title: articleTitle,
        content: editedContent,
      });
      setArticle(updatedArticle);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update article:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(article.content);
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 overflow-y-auto h-full ">
        {isEditing?
					(
						<div className="flex justify-between items-center">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md mb-4"
            placeholder="Article title"
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
            required
          />
						</div>
						
        ):(
						<div className="flex justify-between items-center">
							<h2 className="text-2xl font-bold text-gray-800 mb-4">{article.title}</h2>
						<button onClick={handleEditClick} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center"
						>
            
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
						</div>
						)}

			
      {isEditing ? (
        <div>
          <Editor data={editedContent} onChange={setEditedContent} />
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <Editor data={article.content} readOnly={true} />
      )}

      {/* Comments Section */}
      {!isEditing && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-gray-700">{comment.text}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
          <form onSubmit={handleAddComment} className="mt-4">
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Add Comment
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Article;
