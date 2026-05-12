"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import styles from "../dashboard.module.css";

type ContentType = "Release" | "Promo" | "Show" | "Press";
type ContentStatus = "Draft" | "Ready" | "Scheduled" | "Published";

type ContentItem = {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  description: string;
  link: string;
  imageUrl: string;
  accent: string;
  updatedAt: string;
};

type DraftItem = {
  title: string;
  type: ContentType;
  status: ContentStatus;
  description: string;
  link: string;
  imageUrl: string;
};

const seedItems: ContentItem[] = [
  {
    id: "night-run",
    title: "Night Run",
    type: "Release",
    status: "Published",
    description:
      "Lead single for the next Conscious Cooper rollout, built for clean visuals and a focused launch.",
    link: "https://consciouscooper.com/releases/night-run",
    imageUrl: "Cover image pending",
    accent: "#c4552d",
    updatedAt: "2 hours ago",
  },
  {
    id: "press-kit",
    title: "Press Kit Refresh",
    type: "Press",
    status: "Ready",
    description:
      "Updated artist bio, short copy, and contact block for booking and media inquiries.",
    link: "https://consciouscooper.com/press-kit",
    imageUrl: "Press image pending",
    accent: "#7a5a45",
    updatedAt: "Yesterday",
  },
  {
    id: "fall-set",
    title: "Fall Set Promo",
    type: "Promo",
    status: "Scheduled",
    description:
      "Promo tile for a seasonal campaign with strong CTA placement and a lightweight landing path.",
    link: "https://consciouscooper.com/promo/fall-set",
    imageUrl: "Promo art pending",
    accent: "#4f6472",
    updatedAt: "3 days ago",
  },
];

const emptyDraft: DraftItem = {
  title: "",
  type: "Release",
  status: "Draft",
  description: "",
  link: "",
  imageUrl: "",
};

export function ContentManager() {
  const [items, setItems] = useState(seedItems);
  const [selectedId, setSelectedId] = useState(seedItems[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState(emptyDraft);

  const filteredItems = items.filter((item) => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return (
      item.title.toLowerCase().includes(search) ||
      item.type.toLowerCase().includes(search) ||
      item.status.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });

  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  function handleDraftChange<K extends keyof DraftItem>(
    key: K,
    value: DraftItem[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newItem: ContentItem = {
      id: `item-${Date.now()}`,
      title: draft.title.trim(),
      type: draft.type,
      status: draft.status,
      description: draft.description.trim(),
      link: draft.link.trim(),
      imageUrl: draft.imageUrl.trim() || "Cover image pending",
      accent: "#c4552d",
      updatedAt: "Just now",
    };

    if (!newItem.title) {
      return;
    }

    setItems((current) => [newItem, ...current]);
    setSelectedId(newItem.id);
    setDraft(emptyDraft);
  }

  return (
    <div className={styles.workspace}>
      <section className={styles.library}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>Library</p>
            <h2 className={styles.sectionTitle}>Content items</h2>
          </div>
          <span className={styles.sectionMeta}>{filteredItems.length} items</span>
        </div>

        <label className={styles.searchWrap}>
          <span className={styles.srOnly}>Search items</span>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search by title, type, or status"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className={styles.itemGrid}>
          {filteredItems.length > 0 ? (
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
                  <span className={styles.itemType}>{item.type}</span>
                  <span className={styles.itemStatus}>{item.status}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </button>
            ))
          ) : (
            <p className={styles.emptyLibrary}>
              No items match that search. Try a different keyword or create a
              new content item.
            </p>
          )}
        </div>
      </section>

      <aside className={styles.inspector}>
        <section className={styles.detailCard}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Selection</p>
              <h2 className={styles.sectionTitle}>Item inspector</h2>
            </div>
          </div>

          {selectedItem ? (
            <>
              <div
                className={styles.detailPreview}
                style={{ backgroundColor: selectedItem.accent }}
              >
                <span>{selectedItem.imageUrl}</span>
              </div>

              <div className={styles.detailStack}>
                <div>
                  <p className={styles.detailKicker}>{selectedItem.type}</p>
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
                    <dt>Link</dt>
                    <dd>{selectedItem.link}</dd>
                  </div>
                </dl>

                <p className={styles.detailCopy}>{selectedItem.description}</p>
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
              <h2 className={styles.sectionTitle}>New content item</h2>
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
                <span>Type</span>
                <select
                  className={styles.input}
                  value={draft.type}
                  onChange={(event) =>
                    handleDraftChange("type", event.target.value as ContentType)
                  }
                >
                  <option>Release</option>
                  <option>Promo</option>
                  <option>Show</option>
                  <option>Press</option>
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
                      event.target.value as ContentStatus,
                    )
                  }
                >
                  <option>Draft</option>
                  <option>Ready</option>
                  <option>Scheduled</option>
                  <option>Published</option>
                </select>
              </label>
            </div>

            <label className={styles.field}>
              <span>Link</span>
              <input
                className={styles.input}
                value={draft.link}
                onChange={(event) => handleDraftChange("link", event.target.value)}
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
                Create item
              </button>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => setDraft(emptyDraft)}
              >
                Reset form
              </button>
            </div>
          </form>
        </section>
      </aside>
    </div>
  );
}
