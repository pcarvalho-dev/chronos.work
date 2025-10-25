/**
 * Location service for reverse geocoding using Nominatim API (OpenStreetMap)
 * Free to use with attribution
 */

interface NominatimResponse {
    display_name: string;
    address: {
        road?: string;
        suburb?: string;
        city?: string;
        state?: string;
        country?: string;
        postcode?: string;
    };
}

export class LocationService {
    private static readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
    private static readonly USER_AGENT = 'ChronosWork/1.0'; // Required by Nominatim

    /**
     * Get address from latitude and longitude using Nominatim reverse geocoding
     * @param latitude - Latitude coordinate
     * @param longitude - Longitude coordinate
     * @returns Formatted address string
     */
    static async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
        try {
            const url = new URL(this.NOMINATIM_URL);
            url.searchParams.append('lat', latitude.toString());
            url.searchParams.append('lon', longitude.toString());
            url.searchParams.append('format', 'json');
            url.searchParams.append('addressdetails', '1');

            const response = await fetch(url.toString(), {
                headers: {
                    'User-Agent': this.USER_AGENT,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Nominatim API returned status ${response.status}`);
            }

            const data = await response.json() as NominatimResponse;

            // Return the full formatted address
            return data.display_name || `${latitude}, ${longitude}`;
        } catch (error) {
            console.error('Error fetching address from coordinates:', error);
            // Return coordinates as fallback
            return `${latitude}, ${longitude}`;
        }
    }

    /**
     * Validate latitude and longitude values
     * @param latitude - Latitude coordinate
     * @param longitude - Longitude coordinate
     * @returns true if valid, false otherwise
     */
    static isValidCoordinates(latitude: number, longitude: number): boolean {
        return (
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
        );
    }
}
