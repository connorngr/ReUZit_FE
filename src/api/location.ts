import axios from 'axios';

const BASE_URL = 'https://provinces.open-api.vn/api';

// Interface cho Province
export interface Province {
    name: string; // Tên tỉnh/thành phố
    code: number; // Mã code của tỉnh/thành phố
    division_type: string; // Loại phân vùng (tỉnh, thành phố trung ương, ...)
    codename: string; // Tên mã hoá (VD: thanh_pho_ha_noi)
    phone_code: number; // Mã vùng điện thoại
    districts: District[]; // Danh sách quận/huyện trong tỉnh
}

// Interface cho District
export interface District {
    name: string; // Tên quận/huyện
    code: number; // Mã code của quận/huyện
    division_type: string; // Loại phân vùng (quận, huyện, ...)
    codename: string; // Tên mã hoá (VD: quan_ba_dinh)
    province_code: number; // Mã code của tỉnh mà quận/huyện thuộc về
    wards: Ward[]; // Danh sách phường/xã trong quận/huyện
}

// Interface cho Ward
export interface Ward {
    name: string; // Tên phường/xã
    code: number; // Mã code của phường/xã
    division_type: string; // Loại phân vùng (phường, xã, ...)
    codename: string; // Tên mã hoá (VD: phuong_phuc_xa)
    district_code: number; // Mã code của quận/huyện mà phường/xã thuộc về
}

export const getProvinceById = async (code: number): Promise<Province> => {
    try {
        const response = await axios.get(`${BASE_URL}/p/${code}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch province`);
    }
};


export const getProvinces = async (): Promise<Province[]> => {
    const response = await axios.get(`${BASE_URL}/p`);
    return response.data;
};

export const searchProvinces = async (keyword: string): Promise<Province[]> => {
    const response = await fetch(`https://provinces.open-api.vn/api/p/search/?q=${keyword}`);
    if (!response.ok) {
        throw new Error('Failed to fetch provinces');
    }
    return await response.json();
};


// Lấy danh sách districts
export const getDistricts = async (provinceCode: string): Promise<District[]> => {
    const response = await axios.get(`${BASE_URL}/d`, {
        params: { province_code: provinceCode },
    });
    return response.data;
};

// Tìm kiếm district
export const searchDistricts = async (keyword: string): Promise<District[]> => {
    const response = await fetch(`${BASE_URL}/d/search/?q=${keyword}`);
    if (!response.ok) {
        throw new Error('Failed to fetch districts');
    }
    return await response.json();
};

// Lấy danh sách wards
export const getWards = async (districtCode: string): Promise<Ward[]> => {
    const response = await axios.get(`${BASE_URL}/w`, {
        params: { district_code: districtCode },
    });
    return response.data;
};

// Tìm kiếm ward
export const searchWards = async (keyword: string): Promise<Ward[]> => {
    const response = await fetch(`${BASE_URL}/w/search/?q=${keyword}`);
    if (!response.ok) {
        throw new Error('Failed to fetch wards');
    }
    return await response.json();
};

export const fetchDistrictsByProvince = async (provinceCode: string): Promise<District[]> => {
    const response = await fetch(`https://provinces.open-api.vn/api/d/search/?q=&province_code=${provinceCode}`);
    if (!response.ok) {
        throw new Error('Failed to fetch districts for selected province');
    }
    return await response.json();
};

export const fetchWardsByDistrict = async (districtCode: string): Promise<Ward[]> => {
    const response = await fetch(`https://provinces.open-api.vn/api/w/search/?q=&district_code=${districtCode}`);
    if (!response.ok) {
      throw new Error('Failed to fetch wards for selected district');
    }
    return await response.json();
  };


