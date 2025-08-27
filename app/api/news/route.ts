import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_NEWSAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'News API key not configured' },
        { status: 500 }
      );
    }

    // Fetch real news from News API
    const response = await fetch(`https://newsapi.org/v2/everything?q=finance+OR+stocks+OR+forex+OR+cryptocurrency&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to match our frontend expectations
    const news = data.articles?.map((article: any, index: number) => ({
      id: index + 1,
      title: article.title,
      description: article.description,
      source: article.source.name,
      publishedAt: article.publishedAt,
      url: article.url,
      category: getCategoryFromContent(article.title, article.description),
      imageUrl: article.urlToImage
    })) || [];

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to categorize news articles
function getCategoryFromContent(title: string, description: string): string {
  const content = (title + ' ' + description).toLowerCase();
  
  if (content.includes('cryptocurrency') || content.includes('bitcoin') || content.includes('ethereum')) {
    return 'Cryptocurrency';
  } else if (content.includes('federal reserve') || content.includes('interest rate') || content.includes('monetary')) {
    return 'Monetary Policy';
  } else if (content.includes('oil') || content.includes('commodity') || content.includes('gold')) {
    return 'Commodities';
  } else if (content.includes('technology') || content.includes('tech') || content.includes('ai')) {
    return 'Technology';
  } else if (content.includes('market') || content.includes('trading') || content.includes('stock')) {
    return 'Markets';
  } else {
    return 'General';
  }
}
