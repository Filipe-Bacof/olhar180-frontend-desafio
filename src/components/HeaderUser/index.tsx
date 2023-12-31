import { useState } from 'react'
import { Box, Avatar, Typography } from '@mui/material'
import { MaterialUISwitch } from '../../components/SwitchTheme'
import { useThemeStore } from '../../stores/themeStore'
import { useAuthStore } from '../../stores/userStore'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { ExitToApp } from '@mui/icons-material'
import './style.css'

export function HeaderUser() {
  const [isShow, setIsShow] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeStore((state) => state)
  const user = useAuthStore((state) => state.user)

  function stringToColor(string: string) {
    let hash = 0
    let i

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    }
  }

  const logOut = () => {
    Cookies.remove('token', { path: '/' })
    localStorage.removeItem('olhar180-user')
    navigate('/')
  }

  function getGithubPhoto() {
    const regex = /github.com\/([^/]+)/
    const match = user?.githubUrl?.match(regex)
    if (match) {
      const urlParts: any = user?.githubUrl?.split('/')
      const username = urlParts[urlParts.length - 1]
      return (
        <img
          className="profilepic"
          src={`https://avatars.githubusercontent.com/${username}`}
          alt={`Foto de perfil de ${user.name}`}
        />
      )
    } else {
      return (
        <Avatar
          alt="avatar"
          {...stringAvatar(`${user.name} ${user.surname}`)}
        />
      )
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '200px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          cursor: 'pointer',
        }}
        onClick={() => setIsShow((prevState) => !prevState)}
      >
        <Typography>{`${user.name} ${user.surname}`}</Typography>
        {user.githubUrl ? (
          getGithubPhoto()
        ) : (
          <Avatar
            alt="avatar"
            {...stringAvatar(`${user.name} ${user.surname}`)}
          />
        )}
      </Box>

      <Box
        sx={{
          width: '220px',
          position: 'absolute',
          backgroundColor: theme ? 'white' : 'black',
          top: 60,
          right: -5,
          borderRadius: '0.5rem',
          border: '1px solid gray',
          padding: '0.7rem',
          display: isShow ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '0.7rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <MaterialUISwitch checked={theme} onChange={toggleTheme} />
          <Typography variant="inherit" color={!theme ? 'white' : 'black'}>
            Tema escolhido
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem',
            cursor: 'pointer',
          }}
          onClick={logOut}
        >
          <ExitToApp fontSize="large" color="error" />
          <Typography variant="inherit" color={!theme ? 'white' : 'black'}>
            Sair
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
