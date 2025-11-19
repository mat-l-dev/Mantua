-- SQL OFICIAL (MANUAL): checklist y recordatorios operativos que complementan a `SQL OFICIAL.sql`.
-- No ejecutes cada sección de forma literal; copia las sentencias que aparecen con valores reales y coméntalas/descoméntalas según necesites.

-- 1. Crear buckets de Supabase Storage (no se puede desde un SQL directo).
--    Opciones válidas:
--    a) Desde el panel web: Supabase > Storage > New bucket
--    b) Con el CLI oficial: `supabase storage bucket create nombre-del-bucket --public`
--    c) Con la API REST de Storage (requiere API key de servicio)
--    El CLI es open source y gratuito; cualquier cargo depende del plan de Supabase que uses (Starter tiene cuota generosa).

--    Recomendación específica para este proyecto:
--      - Nombre del bucket: `contenido-publico`
--      - Público: sí (sirve archivos estáticos del ecommerce).
--      - Límite por archivo: 100 MB (puedes ampliarlo si trabajás con PDFs grandes).
--      - Cache-Control sugerido: `max-age=31536000`
--      - Política de retención: mantené versiones públicas solo si lo requiere el negocio.
--
--    Comando CLI sugerido:
--
--    ```bash
--    supabase login
--    supabase projects list
--    supabase storage bucket create contenido-publico --public --file-size-limit 100mb
--    ```
--
--    Si necesitás un bucket privado (ej. para documentos sensibles), vuelve a correr el comando sin `--public` y luego crea una policy manual.

-- 2. Registrar el bucket recién creado en la configuración de la app (puedes usar esta sentencia y ajustar el valor):
INSERT INTO system_config (key, value, description) VALUES
    ('storage.bucket.main', '"contenido-publico"'::jsonb, 'Bucket principal de imágenes y documentos'),
    ('storage.bucket.public_url', '"https://<proyecto>.supabase.co/storage/v1/object/public/contenido-publico"'::jsonb, 'URL base pública del bucket');

-- 3. Definir la política de acceso si necesitás objetos privados (ejemplo de metadata de cabeceras comentadas):
-- ALTER STORAGE POLICY (manual desde UI o API); aquí solo dejamos el recordatorio.

--    Ejemplo de política SQL para un bucket privado (ajustá bucket_id y role() según convenga):
--    ```sql
--    CREATE POLICY "Private read" ON storage.objects
--    FOR SELECT
--    USING (bucket_id = 'contenido-publico' AND auth.role() = 'authenticated');
--    ```

-- 4. Si vas a usar Resend o notificaciones, asegurate de tener en `system_config` las claves y endpoints:
INSERT INTO system_config (key, value, description) VALUES
    ('email.provider', '"resend"'::jsonb, 'Proveedor de emails usado por el backend'),
    ('email.resend_api_key', '"tu_api_key_de_resend"'::jsonb, 'API key de Resend (mantener secreta)'),
    ('email.resend_base_url', '"https://api.resend.com"'::jsonb, 'Endpoint de Resend (si usás otro, reemplazalo)');

-- 5. Validación manual: subí un archivo y verifica su URL pública.
--    ```bash
--    supabase storage file upload contenido-publico ./samples/kit-starlink.jpg --public
--    ```
--    Luego abrí: `https://<proyecto>.supabase.co/storage/v1/object/public/contenido-publico/kit-starlink.jpg`
--    Si el archivo carga, el bucket quedó listo.

-- 6. Registro de webhooks o integraciones externas (por ejemplo, el webhook que dispare una notificación tras recibir el comprobante de pago) también va en este archivo.

