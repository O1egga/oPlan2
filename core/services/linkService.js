export async function createLink(link) {

  const response = await fetch("./api/links/createLink.php", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      fromPort: Number(link.fromPort),
      toPort: Number(link.toPort),
      linkTypeId: Number(link.linkTypeId)
    })

  })

  const result = await response.json()

  if (!response.ok || !result.success) {

    throw new Error(
      result.error || "Ошибка сохранения Link"
    )

  }

  return result.id

}


export async function updateLink(link) {

  const response = await fetch("./api/links/updateLink.php", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      id: Number(link.key),
      fromPort: Number(link.fromPort),
      toPort: Number(link.toPort),
      linkTypeId: Number(link.linkTypeId)
    })

  })

  const result = await response.json()

  if (!response.ok || !result.success) {

    throw new Error(
      result.error || "Ошибка обновления Link"
    )

  }

}


export async function deleteLink(id) {

  const response = await fetch("./api/links/deleteLink.php", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      id: Number(id)
    })

  })

  const result = await response.json()

  if (!response.ok || !result.success) {

    throw new Error(
      result.error || "Ошибка удаления Link"
    )

  }

}