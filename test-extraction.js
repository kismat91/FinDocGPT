// Simple test script to verify news content extraction
const testArticleExtraction = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/news/full-article', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        url: 'https://nep123.com/oil-imports-soar-revenue-jumps-12/' 
      }),
    });

    const data = await response.json();
    console.log('Extraction Result:', {
      success: data.success,
      contentLength: data.content?.length || 0,
      wordCount: data.wordCount,
      extractionQuality: data.extractionQuality,
      imageCount: data.images?.length || 0,
      title: data.title,
      // First 200 characters of content
      contentPreview: data.content?.substring(0, 200) + '...'
    });

    return data;
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testArticleExtraction();
