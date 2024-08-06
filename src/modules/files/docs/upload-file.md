```mermaid
sequenceDiagram
    WEB ->>+API: Post /files
    API ->>+S3: create File Url
    S3 -->>- API: <url>
    API -->>- WEB: <url>
    WEB ->>+ S3: Post image <url>
    S3 -->>- WEB: 200
    WEB ->>+API: Post /files/{uuid}/confirm-upload
```