;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-found (err u100))
(define-constant err-unauthorized (err u101))
(define-constant err-invalid-level (err u102))
(define-constant max-skill-level u5)

;; Data structures
(define-map profiles
  principal
  {
    name: (string-ascii 50),
    created-at: uint
  }
)

(define-map skills
  { owner: principal, name: (string-ascii 50) }
  {
    level: uint,
    last-updated: uint
  }
)

;; Public functions
(define-public (create-profile (name (string-ascii 50)))
  (begin
    (map-set profiles
      tx-sender
      {
        name: name,
        created-at: block-height
      }
    )
    (ok true)
  )
)

(define-public (add-skill (name (string-ascii 50)) (initial-level uint))
  (if (and (>= initial-level u0) (<= initial-level max-skill-level))
    (begin
      (map-set skills
        { owner: tx-sender, name: name }
        {
          level: initial-level,
          last-updated: block-height
        }
      )
      (ok true)
    )
    err-invalid-level
  )
)

(define-public (update-skill-level (name (string-ascii 50)) (new-level uint))
  (let ((skill (get-skill-data tx-sender name)))
    (if (and (>= new-level u0) (<= new-level max-skill-level))
      (begin
        (map-set skills
          { owner: tx-sender, name: name }
          {
            level: new-level,
            last-updated: block-height
          }
        )
        (ok true)
      )
      err-invalid-level
    )
  )
)

;; Read only functions
(define-read-only (get-profile (user principal))
  (ok (map-get? profiles user))
)

(define-read-only (get-skill-level (user principal) (name (string-ascii 50)))
  (let ((skill (get-skill-data user name)))
    (ok (get level skill))
  )
)

(define-read-only (get-skill-data (user principal) (name (string-ascii 50)))
  (default-to
    { level: u0, last-updated: u0 }
    (map-get? skills { owner: user, name: name })
  )
)
