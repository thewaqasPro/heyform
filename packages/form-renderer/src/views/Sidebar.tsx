import clsx from 'clsx'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTransition } from 'react-transition-state'

import { sliceFieldsByLogics, treeFields, useTranslation } from '../utils'
import { helper } from '@kyndform/utils'

import { Button, CollapseIcon, XIcon } from '../components'
import { TRANSITION_UNMOUNTED_STATES } from '../consts'
import { useStore } from '../store'
import type { IPartialFormField } from '../typings'

interface QuestionProps {
  field: IPartialFormField
  selectedId: string
  onClick: (id: string) => void
}

const Question: FC<QuestionProps> = ({ field, selectedId, onClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isSelected = useMemo(() => selectedId === field.id, [selectedId, field.id])
  const isGroup = useMemo(() => helper.isValidArray(field.children), [field.children])

  function handleClick() {
    onClick(field.id)
  }

  function handleToggleCollapse() {
    if (isGroup) {
      setIsCollapsed(!isCollapsed)
    }
  }

  return (
    <div
      className={clsx('kyndform-sidebar-question', {
        'kyndform-sidebar-question-group': isGroup,
        'kyndform-sidebar-question-selected': isSelected,
        'kyndform-sidebar-question-collapsed': isCollapsed
      })}
    >
      <div className="kyndform-sidebar-question-root">
        <div className="kyndform-sidebar-question-toggle-collapse" onClick={handleToggleCollapse}>
          {isGroup && (
            <CollapseIcon
              className={clsx({
                '-rotate-90 transform': isCollapsed
              })}
            />
          )}
        </div>
        <div
          id={`kyndform-sidebar-${field.id}`}
          className="kyndform-sidebar-question-title"
          onClick={handleClick}
        >
          {field.title}
        </div>
      </div>

      {isGroup && (
        <div className="kyndform-sidebar-question-children">
          {field.children!.map(c => (
            <Question key={c.id} field={c} selectedId={selectedId} onClick={onClick} />
          ))}
        </div>
      )}
    </div>
  )
}

export const Sidebar: FC = () => {
  const { state, dispatch } = useStore()
  const { t } = useTranslation()
  const fields = useMemo(
    () => treeFields(sliceFieldsByLogics(state.fields, state.jumpFieldIds)),
    [state.fields, state.logics]
  )

  function handleClick(fieldId: string) {
    dispatch({
      type: 'scrollToField',
      payload: {
        fieldId
      }
    })
  }

  function handleCloseSidebar() {
    dispatch({
      type: 'setIsSidebarOpen',
      payload: {
        isSidebarOpen: false
      }
    })
  }

  useEffect(() => {
    if (!helper.isNil(state.scrollIndex)) {
      const field = state.fields[state.scrollIndex!]
      const container = document.querySelector('.kyndform-sidebar-content')
      const element = container?.querySelector(`#kyndform-sidebar-${field.id}`)

      if (container && element) {
        const containerRect = container.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()

        // Reset scroll position if block changes
        container.scrollTop = elementRect.y + container.scrollTop - containerRect.y
      }
    }
  }, [state.scrollIndex])

  const [transitionState, toggle] = useTransition({
    timeout: 3200,
    initialEntered: false,
    unmountOnExit: true
  })

  useEffect(() => {
    toggle(state.isSidebarOpen)
  }, [state.isSidebarOpen])

  if (!state.isSidebarOpen || TRANSITION_UNMOUNTED_STATES.includes(transitionState.status)) {
    return null
  }

  return (
    <div className={clsx('kyndform-sidebar', `kyndform-sidebar-${transitionState.status}`)}>
      <div className="kyndform-sidebar-container">
        <div className="kyndform-sidebar-heading">
          <h2 className="kyndform-sidebar-title">{t('Questions')}</h2>
          <Button.Link leading={<XIcon />} onClick={handleCloseSidebar} />
        </div>
        <div className="kyndform-sidebar-content kyndform-scrollbar">
          <div className="kyndform-sidebar-question-list">
            {fields.map(field => (
              <Question
                key={field.id}
                field={field}
                selectedId={state.fields[state.scrollIndex!]?.id}
                onClick={handleClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
