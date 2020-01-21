import React, { useRef, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'

import { Colors, FontSizes } from '../../lib/style-guide'
import { classNames } from '../../lib/classnames'
import { randomClassName } from '../../lib/rcn'

import FileUploadService, { Response } from '../../lib/service'
import { CompanyIcon } from '../../icons/companyicon'

const rcn = randomClassName()

const STATUS_READY = 'STATUS_READY'
const STATUS_UPLOADING = 'STATUS_UPLOADING'
const STATUS_UPLOADED = 'STATUS_UPLOADED'

const Uploader: FC = ({ className, value, onChange }) => {
  const [status, setStatus] = useState(STATUS_READY)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const fileEl = useRef<HTMLInputElement>(null)
  const statusText = useStatusText(status)
  const actionText = useActionText(status)
  const path = useCircle(progress, 80, 80, 0)

  const dragEnterHandler = useCallback(
    (e) => {
      e.persist()
      e.nativeEvent.preventDefault()
      e.nativeEvent.stopPropagation()
      setDragging(true)
    },
    [setDragging]
  )
  const dragOverHandler = useCallback(
    (e) => {
      e.persist()
      e.nativeEvent.preventDefault()
      e.nativeEvent.stopPropagation()
      setDragging(true)
    },
    [setDragging]
  )
  const dragLeaveHandler = useCallback(
    (e) => {
      e.persist()
      e.nativeEvent.preventDefault()
      e.nativeEvent.stopPropagation()
      setDragging(false)
    },
    [setDragging]
  )
  const dropHandler = useCallback((e, handleFileUpload) => {
    e.persist()
    e.nativeEvent.preventDefault()
    e.nativeEvent.stopPropagation()
    if (
      e.nativeEvent.dataTransfer.files &&
      e.nativeEvent.dataTransfer.files.length > 0
    ) {
      handleFileUpload(e.nativeEvent.dataTransfer.files[0])
    }
  }, [])
  const handleAction = useCallback((status) => {
    if (status === STATUS_UPLOADING) {
      cancelUploading()
    } else {
      requestFile()
    }
  }, [])
  const fileChangeHandler = useCallback((e, handleFileUpload) => {
    e.persist()
    e.nativeEvent.preventDefault()
    e.nativeEvent.stopPropagation()
    if (e.nativeEvent.target.files && e.nativeEvent.target.files.length > 0) {
      handleFileUpload(e.nativeEvent.target.files[0])
      e.nativeEvent.target.value = null
    }
  }, [])

  const requestFile = () => {
    if (fileEl && fileEl.current) {
      fileEl.current.click()
    }
  }

  const cancelUploading = () => {
    FileUploadService.cancel()
    setProgress(0)
    setStatus(STATUS_READY)
  }

  const handleFileUpload = (file: File) => {
    setDragging(false)
    if (
      file.type.startsWith('image/png') === false &&
      file.type.startsWith('image/jpeg') === false
    ) {
      alert('Logo should be in png, jpeg file format.')
      return
    }
    const img = new Image()
    const _URL = window.URL || window.webkitURL
    const objectUrl = _URL.createObjectURL(file)
    img.onload = () => {
      _URL.revokeObjectURL(objectUrl)
      if (img.width !== 100 || img.height !== 100) {
        alert('Logo should be square, 100px size.')
        return
      }
      setStatus(STATUS_UPLOADING)
      let url: string | null | undefined = null
      FileUploadService.upload(file).subscribe({
        next(data: Response) {
          setProgress(data.progress)
          url = data.url
        },
        error(err) {
          alert(err)
          setStatus(STATUS_READY)
        },
        complete() {
          setStatus(STATUS_UPLOADED)
          if (onChange) {
            onChange(url)
          }
        }
      })
    }
    img.src = objectUrl
  }

  return (
    <div className={className}>
      <div
        onDragEnter={dragEnterHandler}
        onDragOver={dragOverHandler}
        onDragLeave={dragLeaveHandler}
        onDrop={(e) => dropHandler(e, handleFileUpload)}
        className={classNames(rcn('st0'), dragging ? rcn('st1') : '')}
      >
        <div className={rcn('st2')}>
          <svg viewBox="0 0 80 80" className={rcn('svg')}>
            <path
              d={path}
              stroke="#4991E5"
              strokeWidth="1"
              fillOpacity="0"
            ></path>
          </svg>
          {value && <img src={value} />}
          {!value && <CompanyIcon />}
        </div>
        <p className={classNames(rcn('st3'), rcn('st4'))}>{statusText}</p>
        <p className={classNames(rcn('st3'), rcn('st5'))}>- or -</p>
        <a
          className={classNames(rcn('st3'), rcn('st6'))}
          onClick={() => handleAction(status)}
        >
          {actionText}
        </a>
      </div>
      <input
        ref={fileEl}
        type="file"
        className="hidden"
        onChange={(e) => fileChangeHandler(e, handleFileUpload)}
        accept="image/png,image/jpeg"
      />
    </div>
  )
}

const useStatusText = (status: string) => {
  const [statusText, setStatusText] = useState('')

  useEffect(() => {
    if (status === STATUS_READY) {
      setStatusText('Drag & drop here')
    } else if (status === STATUS_UPLOADING) {
      setStatusText('Uploading')
    } else if (status === STATUS_UPLOADED) {
      setStatusText('Drag & drop here to replace')
    }
  }, [status])

  return statusText
}

const useActionText = (status: string) => {
  const [actionText, setActionText] = useState('')

  useEffect(() => {
    if (status === STATUS_READY) {
      setActionText('Select file to upload')
    } else if (status === STATUS_UPLOADING) {
      setActionText('Cancel')
    } else if (status === STATUS_UPLOADED) {
      setActionText('Select file to replace')
    }
  }, [status])

  return actionText
}

const useCircle = (
  progress: number,
  width: number,
  height: number,
  startAngle: number
) => {
  const [path, setPath] = useState('')

  useEffect(() => {
    const cos = Math.cos
    const sin = Math.sin
    const π = Math.PI

    const matrixTimes = ([[a, b], [c, d]]: number[][], [x, y]: number[]) => [
      a * x + b * y,
      c * x + d * y
    ]
    const rotateMatrix = (x: number) => [
      [cos(x), -sin(x)],
      [sin(x), cos(x)]
    ]
    const vecAdd = ([a1, a2]: number[], [b1, b2]: number[]) => [
      a1 + b1,
      a2 + b2
    ]

    const createM = (
      [cx, cy]: [number, number],
      [rx, ry]: [number, number],
      [t1, Δ]: [number, number],
      φ: number
    ) => {
      /* [
      returns a SVG path element that represent a ellipse.
      cx,cy → center of ellipse
      rx,ry → major minor radius
      t1 → start angle, in radian.
      Δ → angle to sweep, in radian. positive.
      φ → rotation on the whole, in radian
      url: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
      Version 2019-06-19
       ] */
      Δ = Δ % (2 * π)
      const rotMatrix = rotateMatrix(φ)
      const [sX, sY] = vecAdd(
        matrixTimes(rotMatrix, [rx * cos(t1), ry * sin(t1)]),
        [cx, cy]
      )
      const [eX, eY] = vecAdd(
        matrixTimes(rotMatrix, [rx * cos(t1 + Δ), ry * sin(t1 + Δ)]),
        [cx, cy]
      )
      const fA = Δ > π ? 1 : 0
      const fS = Δ > 0 ? 1 : 0
      return (
        'M ' +
        sX +
        ' ' +
        sY +
        ' A ' +
        [rx, ry, (φ / (2 * π)) * 360, fA, fS, eX, eY].join(' ')
      )
    }

    const angle = (startAngle + 360.0 * progress) % 360.0
    const startRadian = (Math.PI * startAngle) / 180.0
    const radian = (Math.PI * angle) / 180.0
    const centerX = width / 2.0
    const centerY = height / 2.0
    const radius = Math.min(width, height) / 2.0
    const M = createM(
      [centerX, centerY],
      [radius, radius],
      [startRadian, radian],
      (270.0 * π) / 180.0
    )
    setPath(M)
  }, [progress, width, height, startAngle])

  return path
}

const StyledUploader = styled(Uploader)`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  
  img {
    width: 100%;
    height: 100%;
  }
  
  .${rcn('svg')} {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }

  .${rcn('st0')} {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  .${rcn('st1')} {
    background: ${Colors.BG3}
    border: 1px dashed #4991E5;
  }

  .${rcn('st2')} {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    padding: 16px;
    border: 1px solid ${Colors.Border}
    border-radius: 40px;
  }
  
  .${rcn('st3')} {
    ${FontSizes.medium}
    line-height: 12px;
    text-align: center;
    margin-top: 9px;
  }

  .${rcn('st4')} {
    color: ${Colors.TX2}
  }

  .${rcn('st5')} {
    color: ${Colors.TX3}
  }

  .${rcn('st6')} {
    cursor: pointer;
    color: #4991E5;
  }
`
export { StyledUploader as Uploader }
