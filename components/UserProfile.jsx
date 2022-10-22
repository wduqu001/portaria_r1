import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import ProfilePicture from './ProfilePicture';

export default function UserProfile({ session }) {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(null);
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [accessGroup, setAccessGroup] = useState(2);
  const [status, setStatus] = useState('active');

  useEffect(() => {
    getUserProfile()
  }, [session])

  async function getUserProfile() {
    try {
      setLoading(true);

      if (!user) throw new Error('No user');

      let { data, error, status } = await supabase
        .from('users')
        .select(`full_name, cpf, address, photo_url, access_group, status`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setName(data.full_name);
        setCpf(data.cpf);
        setAddress(data.address);
        setPhotoURL(data.photo_url);
        setAccessGroup(data.access_group);
        setStatus(data.status);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true)
      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        full_name: name,
        cpf,
        address,
        photo_url: photoURL,
        access_group: accessGroup,
        status,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('users').upsert(updates);

      if (error) throw error;
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function onCPFChange(value) {
    if(!value) return ``;

    let cpf = "";
    let parts = Math.ceil(value.length / 3);

    for (let i = 0; i < parts; i++) {
      if (i === 3) {
        cpf += `-${value.substr(i * 3)}`;
        break;
      }
      cpf += `${i !== 0 ? "." : ""}${value.substr(i * 3, 3)}`;
    }

    return cpf;
  }

  return (
    <div className="form-widget">
      <ProfilePicture
        uid={user.id}
        url={photoURL}
        size={150}
        onUpload={(url) => {
          setPhotoURL(url);
          updateProfile();
        }}
      />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name || ''}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="cpf">CPF</label>
        <input
          id="cpf"
          type="text"
          value={onCPFChange(cpf) || ''}
          maxLength="14"
          onChange={(event) => setCpf(event.target.value.replace(/\D/g, ""))}
        />
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          value={address || ''}
          onChange={(event) => setAddress(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="accessGroup">Acess Group</label>
        <select
          className='button'
          name="accessGroup"
          id="accessGroup"
          value={accessGroup?.toString() || ''}
          onChange={(event) => setAccessGroup(Number.parseInt(event.target.value))}
        >
          <option value="1">Administrators</option>
          <option value="2">Visitors</option>
        </select>
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile()}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
