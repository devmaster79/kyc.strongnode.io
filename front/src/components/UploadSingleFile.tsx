import { DropzoneOptions, useDropzone } from 'react-dropzone'
// material
import {
  Box,
  Typography,
  Paper,
  SxProps,
  Theme,
  alpha,
  styled
} from '@mui/material'
// utils
// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  minWidth: '9.5em',
  display: 'flex',
  overflow: 'hidden',
  textAlign: 'center',
  height: '100%',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(5, 0),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey['500_32']}`,
  '&:hover': {
    opacity: 0.72,
    cursor: 'pointer'
  },
  [theme.breakpoints.up('md')]: { flexDirection: 'row' }
}))

export interface UploadSingleFileProps extends DropzoneOptions {
  error?: boolean
  file?: { preview: string }
  sx?: SxProps<Theme>
}

export default function UploadSingleFile({
  error = false,
  file,
  sx,
  ...other
}: UploadSingleFileProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    multiple: false,
    ...other
  })

  const ShowRejectionItems = () => (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: 'error.light',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08)
      }}>
      {fileRejections.map(({ file, errors }) => {
        return (
          <Box key={file.name} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {file.name}
            </Typography>
            {errors.map((error) => (
              <Typography key={error.code} variant="caption" component="p">
                - {error.message}
              </Typography>
            ))}
          </Box>
        )
      })}
    </Paper>
  )

  return (
    <Box sx={{ ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter'
          }),
          ...(file && { padding: '12% 0' })
        }}>
        <input {...getInputProps()} />

        {!file && (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Drop files here or click
            </Typography>
          </Box>
        )}

        {file && (
          <Box
            component="img"
            alt="file preview"
            src={file && file.preview}
            sx={{
              top: 8,
              borderRadius: 1,
              objectFit: 'cover',
              position: 'absolute',
              width: 'calc(100% - 16px)',
              height: 'calc(100% - 16px)'
            }}
          />
        )}
      </DropZoneStyle>

      {fileRejections.length > 0 && <ShowRejectionItems />}
    </Box>
  )
}
