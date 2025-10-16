import { jwtDecode } from 'jwt-decode';
import { ITokenDecode } from '../models/auth.model';
import { ILocalItemData } from '../models/cart.model';
import { environment } from '../../../environments/environment';

// For Token
const TOKEN_KEY = 'token';

export function decodeValidToken() {
  const token = getToken();
  if (token) {
    try {
      const decode = jwtDecode<ITokenDecode>(token);
      const expInMs = decode.exp * 1000;
      if (Date.now() < expInMs) {
        return decode;
      } else {
        removeToken();
      }
    } catch (err) {
      console.log(`Error in decoding token: ${err}`);
      return null;
    }
  }
  return null;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  return localStorage.removeItem(TOKEN_KEY);
}

// For cart
const CART_KEY = 'cart';

export function getLocalCart(): ILocalItemData[] | null {
  const cart = localStorage.getItem(CART_KEY);
  if (cart) {
    return JSON.parse(cart);
  }
  return null;
}

export function getLocalCartQuantity(): number {
  const cart = getLocalCart();
  if (cart) {
    const quantity = cart.reduce(
      (sum: number, item: ILocalItemData) => Number(sum) + Number(item.quantity),
      0
    );
    return quantity;
  }
  return 0;
}

export function addToLocalCart(itemData: ILocalItemData) {
  const cart = getLocalCart();
  let newCart!: ILocalItemData[];
  if (cart) {
    newCart = cart;
    const itemIndex = cart.findIndex((item) => item.productId === itemData.productId);
    if (itemIndex === -1) {
      newCart.push(itemData);
    } else {
      newCart = cart.map((item, i) => {
        if (i === itemIndex) {
          return itemData;
        } else {
          return item;
        }
      });
    }
  } else {
    newCart = [];
    newCart.push(itemData);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(newCart));
}

export function removeFromLocalCart(productId: string) {
  const cart = getLocalCart();
  if (cart) {
    const newCart = cart.filter((item) => item.productId !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  }
}

export function removeLocalCart() {
  localStorage.removeItem(CART_KEY);
}

export function uploadLocalCartToDB(callback?: () => void) {
  const cart = getLocalCart();
  if (!cart || cart.length === 0) return;

  // Create an array of promises
  const uploadPromises = cart.map((item) => {
    const body = JSON.stringify({
      productId: item.productId,
      quantity: item.quantity,
      priceAtAdding: item.priceAtAdding,
    });

    return fetch(`${environment.apiUrl}/cart`, {
      method: 'POST',
      body: body,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    }).catch((err) => {
      console.error(`Error uploading local item ${item.productId}:`, err);
    });
  });

  // Wait for all requests to finish, then call the callback
  Promise.all(uploadPromises).then(() => {
    removeLocalCart();
    if (callback) callback();
  });
}
