import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { getArticle, getComments, createComment, updateArticle } from '../services/api';
import Editor from './Editor';
import { PencilIcon } from '@heroicons/react/24/outline';

function ArticleModal({ isOpen, onClose, articleId }) {
  const cancelButtonRef = useRef(null);
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      try {
        const data = await getArticle(articleId);
        setArticle(data);
        setArticleTitle(data.title);
        setArticleContent(data.content);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      }
    };

    const fetchComments = async () => {
      if (!articleId) return;
      try {
        const data = await getComments(articleId);
        setComments(data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    if (isOpen && articleId) {
      fetchArticle();
      fetchComments();
    }
  }, [isOpen, articleId]);

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

  const handleUpdateArticle = async () => {
    try {
      const updatedArticle = await updateArticle(articleId, {
        title: articleTitle,
        content: articleContent,
        category: article.category,
        notebook: article.notebook
      });
      setArticle(updatedArticle);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update article:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {article?.title}
                    </h3>
                    <div className="mt-2">
                      {isEditing ? (
                        <div>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md mb-4"
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
                              onClick={handleUpdateArticle}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <Editor
                          data={articleContent}
                          readOnly={true}
                        />
                      )}
                    </div>
                    {!isEditing && (
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={handleEditClick}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {/* Comments section */}
                    {!isEditing && (
                      <div className="mt-8 border-t pt-6">
                        <h4 className="text-lg font-semibold mb-4">Comments</h4>
                        <div className="space-y-4">
                          {comments.map(comment => (
                            <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
                              <p className="text-gray-700">{comment.text}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        {/* Add comment form */}
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
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                  ref={cancelButtonRef}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ArticleModal;
