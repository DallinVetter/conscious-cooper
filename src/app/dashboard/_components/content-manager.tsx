"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Product, ProductCategory, ProductStatus } from "@/lib/products";
import styles from "../dashboard.module.css";

type DraftProduct = {
  title: string;
  category: ProductCategory;
  status: ProductStatus;
  description: string;
  price: string;
  imageUrl: string;
  externalUrl: string;
};

const emptyDraft: DraftProduct = {
  title: "",
  category: "Music",
  status: "Draft",
  description: "",
  price: "",
  imageUrl: "",
  externalUrl: "",
};

export function ProductManager() {
  const [items, setItems] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState(emptyDraft);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load products (${response.status}).`);
        }

        const data = (await response.json()) as { products?: Product[] };
        const products = Array.isArray(data.products) ? data.products : [];

        setItems(products);
        setSelectedId((current) => {
          if (current && products.some((product) => product.id === current)) {
            return current;
          }

          return products[0]?.id ?? "";
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load products.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, []);

  const filteredItems = items.filter((item) => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return (
      item.title.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.status.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.externalUrl.toLowerCase().includes(search)
    );
  });

  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  function handleDraftChange<K extends keyof DraftProduct>(
    key: K,
    value: DraftProduct[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const title = draft.title.trim();

    if (!title) {
      setSubmitError("Title is required.");
      return;
    }

    const priceInput = draft.price.trim();
    if (priceInput !== "") {
      const parsedPrice = Number(priceInput);

      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        setSubmitError("Price must be a valid non-negative number.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category: draft.category,
          status: draft.status,
          description: draft.description,
          price: priceInput === "" ? null : Number(priceInput),
          imageUrl: draft.imageUrl,
          externalUrl: draft.externalUrl,
        }),
      });

      const data = (await response.json()) as
        | { product: Product }
        | { error?: string };

      if (!response.ok || !("product" in data)) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Failed to create product.",
        );
      }

      setItems((current) => [data.product, ...current]);
      setSelectedId(data.product.id);
      setLoadError("");
      setStatusError("");
      setDraft(emptyDraft);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create product.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePublishProduct() {
    if (!selectedItem) {
      return;
    }

    setStatusError("");
    setIsPublishing(true);

    try {
      const response = await fetch(`/api/products/${selectedItem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Published" }),
      });

      const data = (await response.json()) as
        | { product: Product }
        | { error?: string };

      if (!response.ok || !("product" in data)) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Failed to publish product.",
        );
      }

      setItems((current) =>
        current.map((product) =>
          product.id === data.product.id ? data.product : product,
        ),
      );
      setSelectedId(data.product.id);
    } catch (error) {
      setStatusError(
        error instanceof Error ? error.message : "Failed to publish product.",
      );
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className={styles.workspace}>
      <section className={styles.library}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>Library</p>
            <h2 className={styles.sectionTitle}>Products</h2>
          </div>
          <span className={styles.sectionMeta}>{filteredItems.length} products</span>
        </div>

        <label className={styles.searchWrap}>
          <span className={styles.srOnly}>Search products</span>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search by title, category, status, or URL"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className={styles.itemGrid}>
          {isLoading ? (
            <p className={styles.emptyLibrary}>Loading products...</p>
          ) : loadError ? (
            <p className={styles.emptyLibrary}>{loadError}</p>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.itemCard} ${
                  item.id === selectedItem?.id ? styles.itemCardActive : ""
                }`}
                onClick={() => setSelectedId(item.id)}
              >
                <div className={styles.cardTop}>
                  <span className={styles.itemType}>{item.category}</span>
                  <span className={styles.itemStatus}>{item.status}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </button>
            ))
          ) : (
            <p className={styles.emptyLibrary}>
              No products match that search. Try a different keyword or create a
              new product.
            </p>
          )}
        </div>
      </section>

      <aside className={styles.inspector}>
        <section className={styles.detailCard}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Selection</p>
              <h2 className={styles.sectionTitle}>Product inspector</h2>
            </div>
          </div>

          {isLoading ? (
            <p className={styles.emptyState}>Loading products...</p>
          ) : loadError ? (
            <p className={styles.emptyState}>{loadError}</p>
          ) : selectedItem ? (
            <>
              <div
                className={styles.detailPreview}
                style={{ backgroundColor: selectedItem.accent }}
              >
                <span>{selectedItem.imageUrl}</span>
              </div>

              <div className={styles.detailStack}>
                <div>
                  <p className={styles.detailKicker}>{selectedItem.category}</p>
                  <h3 className={styles.detailTitle}>{selectedItem.title}</h3>
                </div>

                <dl className={styles.detailList}>
                  <div className={styles.detailRow}>
                    <dt>Status</dt>
                    <dd>{selectedItem.status}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt>Updated</dt>
                    <dd>{selectedItem.updatedAt}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt>Price</dt>
                    <dd>{selectedItem.price === null ? "N/A" : `$${selectedItem.price.toFixed(2)}`}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt>Link</dt>
                    <dd>{selectedItem.externalUrl}</dd>
                  </div>
                </dl>

                <p className={styles.detailCopy}>{selectedItem.description}</p>
                {selectedItem.status !== "Published" ? (
                  <div className={styles.buttonRow}>
                    <button
                      className={styles.primaryButton}
                      type="button"
                      onClick={handlePublishProduct}
                      disabled={isPublishing}
                    >
                      {isPublishing ? "Publishing..." : "Publish Product"}
                    </button>
                  </div>
                ) : null}
                {statusError ? (
                  <p className={styles.emptyState}>{statusError}</p>
                ) : null}
              </div>
            </>
          ) : (
            <p className={styles.emptyState}>
              Pick an item from the library to inspect it here.
            </p>
          )}
        </section>

        <section className={styles.formCard}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Create</p>
              <h2 className={styles.sectionTitle}>New product</h2>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleCreate}>
            <label className={styles.field}>
              <span>Title</span>
              <input
                className={styles.input}
                required
                value={draft.title}
                onChange={(event) =>
                  handleDraftChange("title", event.target.value)
                }
                placeholder="Night Run"
              />
            </label>

            <div className={styles.twoUp}>
              <label className={styles.field}>
                <span>Category</span>
                <select
                  className={styles.input}
                  value={draft.category}
                  onChange={(event) =>
                    handleDraftChange(
                      "category",
                      event.target.value as ProductCategory,
                    )
                  }
                >
                  <option>Apparel</option>
                  <option>Accessories</option>
                  <option>Music</option>
                  <option>Prints</option>
                  <option>Digital</option>
                  <option>Other</option>
                </select>
              </label>

              <label className={styles.field}>
                <span>Status</span>
                <select
                  className={styles.input}
                  value={draft.status}
                  onChange={(event) =>
                    handleDraftChange(
                      "status",
                      event.target.value as ProductStatus,
                    )
                  }
                >
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Sold Out</option>
                  <option>Coming Soon</option>
                </select>
              </label>
            </div>

            <label className={styles.field}>
              <span>Price</span>
              <input
                className={styles.input}
                inputMode="decimal"
                value={draft.price}
                onChange={(event) => handleDraftChange("price", event.target.value)}
                placeholder="42"
              />
            </label>

            <label className={styles.field}>
              <span>External URL</span>
              <input
                className={styles.input}
                value={draft.externalUrl}
                onChange={(event) =>
                  handleDraftChange("externalUrl", event.target.value)
                }
                placeholder="https://consciouscooper.com/..."
              />
            </label>

            <label className={styles.field}>
              <span>Cover image note</span>
              <input
                className={styles.input}
                value={draft.imageUrl}
                onChange={(event) =>
                  handleDraftChange("imageUrl", event.target.value)
                }
                placeholder="Cover image pending"
              />
            </label>

            <label className={styles.field}>
              <span>Short description</span>
              <textarea
                className={styles.textarea}
                rows={4}
                value={draft.description}
                onChange={(event) =>
                  handleDraftChange("description", event.target.value)
                }
                placeholder="Short summary for the content manager"
              />
            </label>

            <div className={styles.buttonRow}>
              <button className={styles.primaryButton} type="submit">
                Create product
              </button>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => setDraft(emptyDraft)}
                disabled={isSubmitting}
              >
                Reset form
              </button>
            </div>
            {submitError ? <p className={styles.emptyState}>{submitError}</p> : null}
          </form>
        </section>
      </aside>
    </div>
  );
}
