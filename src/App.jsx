import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(a => a.id === product.categoryId);
  const user = usersFromServer.find(b => b.id === category?.ownerId);

  return { ...product, category, user };
});

export const App = () => {
  const [userId, setUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState([]);

  const resetAllFilters = () => {
    setQuery('');
    setUserId(0);
    setCategoryId([]);
  };

  let copyProducts = [...products];

  if (userId !== 0) {
    copyProducts = copyProducts.filter(p => p.user?.id === userId);
  }

  if (query) {
    const tolowerQuery = query.toLowerCase();

    copyProducts = copyProducts.filter(p =>
      p.name.toLowerCase().includes(tolowerQuery),
    );
  }

  if (categoryId.length > 0) {
    copyProducts = copyProducts.filter(p => categoryId.includes(p.categoryId));
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={userId === 0 ? 'is-active' : ''}
                onClick={() => setUserId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  key={user.id}
                  href="#/"
                  onClick={() => setUserId(user.id)}
                  className={user.id === userId ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="search"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                data-cy="AllCategories"
                href="#/"
                className={`button is-success mr-6 ${categoryId.length !== 0 ? 'is-outlined' : ''}`}
                onClick={() => setCategoryId([])}
              >
                All
              </a>

              {categoriesFromServer.map(category =>
                categoryId.includes(category.id) ? (
                  <a
                    data-cy="Category"
                    key={category.id}
                    className="button mr-2 my-1 is-info"
                    href="#/"
                    onClick={() => {
                      setCategoryId(currentCategoryIds =>
                        currentCategoryIds.filter(id => id !== category.id),
                      );
                    }}
                  >
                    {category.title}
                  </a>
                ) : (
                  <a
                    data-cy="Category"
                    key={category.id}
                    className="button mr-2 my-1"
                    href="#/"
                    onClick={() => {
                      setCategoryId(currentCategoryIds => [
                        ...currentCategoryIds,
                        category.id,
                      ]);
                    }}
                  >
                    {category.title}
                  </a>
                ),
              )}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {copyProducts.length === 0 ? (
            <p>No products matching selected criter</p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>

              <tbody>
                {copyProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>
                      {product.category.icon} - {product.category.title}
                    </td>
                    <td
                      className={
                        product.user.gender === 'male'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
