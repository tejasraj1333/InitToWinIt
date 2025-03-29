import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from '@/components/NewsCard'; // Adjust the import path as needed

const Publisher: React.FC = () => {
  // Mock data to pre-fill the form
  const mockArticle = {
    title: 'Sample Article Title',
    content: 'This is a sample article content. It gives a brief overview of the news event...',
    date: '2025-03-29',
    blogLink: 'https://www.sampleblog.com/article123',
    publisherType: 'individual' as 'individual' | 'company',
    publisherName: 'John Doe',
    publisherEmail: 'johndoe@gmail.com',
    companyName: '',
  };

  const [title, setTitle] = useState(mockArticle.title);
  const [content, setContent] = useState(mockArticle.content);
  const [date, setDate] = useState(mockArticle.date);
  const [blogLink, setBlogLink] = useState(mockArticle.blogLink);
  const [publisherType, setPublisherType] = useState(mockArticle.publisherType);
  const [publisherName, setPublisherName] = useState(mockArticle.publisherName);
  const [publisherEmail, setPublisherEmail] = useState(mockArticle.publisherEmail);
  const [companyName, setCompanyName] = useState(mockArticle.companyName);
  const [publishedArticles, setPublishedArticles] = useState<any[]>([]); // State to store published articles

  const navigate = useNavigate();

  const handlePublish = () => {
    const newArticle = {
      id: Date.now().toString(), // Unique ID for the article
      title,
      summary: content.substring(0, 100) + '...', // Short summary
      category: publisherType === 'individual' ? 'Individual' : 'Company',
      image: '', // Optional: Add an image URL if needed
      source: publisherType === 'individual' ? publisherName : companyName,
      publishedAt: date,
      commentsCount: 0,
      likesCount: 0,
      url: blogLink || '#', // Use the blog link or a placeholder
    };

    setPublishedArticles((prev) => [newArticle, ...prev]); // Add the new article to the list
    console.log("Article published:", newArticle);

    // Clear the form
    setTitle('');
    setContent('');
    setDate('');
    setBlogLink('');
    setPublisherName('');
    setPublisherEmail('');
    setCompanyName('');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold">Publisher Page</h1>
      
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}  // This will navigate to the previous page
        className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-md"
      >
        Go Back
      </button>

      {/* Form */}
      <form onSubmit={(e) => { e.preventDefault(); handlePublish(); }} className="mt-4 space-y-4">
        
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full px-4 py-2 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium">Content</label>
          <textarea
            id="content"
            className="mt-1 block w-full px-4 py-2 border rounded-md"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Date Input */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium">Date</label>
          <input
            type="date"
            id="date"
            className="mt-1 block w-full px-4 py-2 border rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Link to Blog */}
        <div>
          <label htmlFor="blogLink" className="block text-sm font-medium">Link to Blog (Optional)</label>
          <input
            type="url"
            id="blogLink"
            className="mt-1 block w-full px-4 py-2 border rounded-md"
            value={blogLink}
            onChange={(e) => setBlogLink(e.target.value)}
          />
        </div>

        {/* Publisher Type Radio Buttons */}
        <div>
          <label className="block text-sm font-medium">Publisher Type</label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="publisherType"
                value="individual"
                checked={publisherType === 'individual'}
                onChange={() => setPublisherType('individual')}
                className="mr-2"
              />
              Individual Publisher
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="publisherType"
                value="company"
                checked={publisherType === 'company'}
                onChange={() => setPublisherType('company')}
                className="mr-2"
              />
              Company/Agency
            </label>
          </div>
        </div>

        {/* Publisher Name and Email (Conditionally Displayed for Individual Publisher) */}
        {publisherType === 'individual' && (
          <>
            <div>
              <label htmlFor="publisherName" className="block text-sm font-medium">Publisher Name</label>
              <input
                type="text"
                id="publisherName"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                value={publisherName}
                onChange={(e) => setPublisherName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="publisherEmail" className="block text-sm font-medium">Publisher Email (Gmail)</label>
              <input
                type="email"
                id="publisherEmail"
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                value={publisherEmail}
                onChange={(e) => setPublisherEmail(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {/* Company Name (Conditionally Displayed for Company Publisher) */}
        {publisherType === 'company' && (
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium">Company Name</label>
            <input
              type="text"
              id="companyName"
              className="mt-1 block w-full px-4 py-2 border rounded-md"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="mt-4 px-6 py-2 bg-primary text-white rounded-md">Publish</button>
      </form>

      {/* Published Articles */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Published Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publishedArticles.map((article) => (
            <NewsCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Publisher;
