import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    console.log('Geocoding address:', address);

    // Using Nominatim (OpenStreetMap's free geocoding service)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`;
    console.log('Fetching from:', url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'EatWithLee/1.0', // Required by Nominatim
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Geocoding response:', data);

    if (!data || data.length === 0) {
      return NextResponse.json({
        error: 'Address not found. Try adding city/state or using a more specific address.'
      }, { status: 404 });
    }

    const result = data[0];
    const coordinates = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
    };

    console.log('Returning coordinates:', coordinates);
    return NextResponse.json(coordinates);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json({
      error: `Geocoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
