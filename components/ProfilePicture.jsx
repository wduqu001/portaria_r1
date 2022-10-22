import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { PROFILE_PICTURE_BUCKET } from '../lib/constants';

export default function ProfilePicture({
  uid,
  url,
  size,
  onUpload,
}) {
  const supabase = useSupabaseClient();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from(PROFILE_PICTURE_BUCKET)
        .download(path);

      if (error) {
        throw error
      }

      const url = URL.createObjectURL(data);
      setPhotoUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error);
    }
  }

  const uploadPhoto = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('profile')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert('Error uploading profile picture!')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt="profile picture"
          className="avatar image"
          height={size}
          width={size}
        />
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadPhoto}
          disabled={uploading}
        />
      </div>
    </div>
  )
}
